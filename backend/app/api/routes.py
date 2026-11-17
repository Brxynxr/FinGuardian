from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.financial import (
    CompanyProfile,
    Employee,
    AgentProposal,
    AuditLog,
    OutboxEmail,
    Customer,
    Vendor,
    ScheduledPayment,
    Invoice,
)
from backend.app.pipeline.forecaster import calculate_cash_projection
from backend.app.pipeline.document_parser import parse_and_ingest_csv, parse_and_ingest_json
from backend.app.agent.orchestrator import FinancialRescueAgent
from backend.app.agent.cfo_copilot import CFOCopilotService
from backend.app.agent.tools import simulate_plan_solution
from backend.app.services.execution_engine import ExecutionEngine
from backend.app.services.seeder import seed_demo_data
from backend.app.services.telegram_bot import telegram_bot_service
from backend.app.schemas.financial_dto import (
    CompanySummaryDTO,
    ProjectionResponseDTO,
    EmployeeDTO,
    CreateEmployeeDTO,
    ChatRequestDTO,
    ApprovalRequestDTO,
    RejectionRequestDTO,
)

router = APIRouter()

@router.get("/financial/summary", response_model=CompanySummaryDTO)
def get_financial_summary(db: Session = Depends(get_db)):
    company = db.query(CompanyProfile).first()
    if not company:
        seed_demo_data(db)
        company = db.query(CompanyProfile).first()

    employees = db.query(Employee).filter(Employee.is_active == True).all()
    total_payroll = sum(e.monthly_salary + e.benefits_cost for e in employees)

    forecast = calculate_cash_projection(db, days_ahead=40)
    return CompanySummaryDTO(
        name=company.name,
        current_balance=company.current_cash_balance,
        safe_threshold=company.safe_cash_threshold,
        has_deficit=forecast.has_deficit,
        first_deficit_date=forecast.first_deficit_date,
        days_until_deficit=forecast.days_until_deficit,
        worst_deficit=forecast.worst_deficit_amount,
        minimum_balance=forecast.minimum_balance,
        health_score=forecast.health_score,
        runway_days=forecast.runway_days,
        burn_rate_daily=forecast.burn_rate_daily,
        total_payroll=total_payroll,
    )

@router.get("/financial/projection", response_model=ProjectionResponseDTO)
def get_financial_projection(days: int = 40, db: Session = Depends(get_db)):
    forecast = calculate_cash_projection(db, days_ahead=days)
    return ProjectionResponseDTO(
        has_deficit=forecast.has_deficit,
        minimum_balance=forecast.minimum_balance,
        health_score=forecast.health_score,
        timeline=[
            {
                "date": p.date,
                "day_offset": p.day_offset,
                "inflow": p.inflow,
                "outflow": p.outflow,
                "net_change": p.net_change,
                "balance": p.balance,
                "pessimistic_balance": p.pessimistic_balance,
                "expected_balance": p.expected_balance,
                "optimistic_balance": p.optimistic_balance,
                "is_deficit": p.is_deficit,
                "events": p.events,
            }
            for p in forecast.timeline
        ],
    )

@router.get("/employees")
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return {
        "employees": [
            {
                "id": e.id,
                "full_name": e.full_name,
                "role_title": e.role_title,
                "email": e.email,
                "monthly_salary": e.monthly_salary,
                "benefits_cost": e.benefits_cost,
                "payment_cutoff_day": e.payment_cutoff_day,
                "is_active": e.is_active,
            }
            for e in employees
        ]
    }

@router.post("/employees", response_model=EmployeeDTO)
def create_employee(payload: CreateEmployeeDTO, db: Session = Depends(get_db)):
    emp = Employee(
        full_name=payload.full_name,
        role_title=payload.role_title,
        email=payload.email,
        monthly_salary=payload.monthly_salary,
        benefits_cost=payload.benefits_cost or (payload.monthly_salary * 0.15),
        payment_cutoff_day=payload.payment_cutoff_day or 30,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.get("/invoices")
def list_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).join(Customer).order_by(Invoice.effective_due_date.asc()).all()
    return {
        "invoices": [
            {
                "id": i.id,
                "invoice_number": i.invoice_number,
                "customer_name": i.customer.name,
                "amount": i.amount,
                "effective_due_date": i.effective_due_date.isoformat(),
                "status": i.status,
                "discount_offered": i.discount_offered,
            }
            for i in invoices
        ]
    }

@router.get("/payments")
def list_payments(db: Session = Depends(get_db)):
    payments = db.query(ScheduledPayment).join(Vendor).order_by(ScheduledPayment.scheduled_date.asc()).all()
    return {
        "payments": [
            {
                "id": p.id,
                "description": p.description,
                "vendor_name": p.vendor.name,
                "amount": p.amount,
                "scheduled_date": p.scheduled_date.isoformat(),
                "status": p.status,
                "category": p.category,
            }
            for p in payments
        ]
    }

@router.post("/chat/cfo")
def chat_with_cfo(payload: ChatRequestDTO, db: Session = Depends(get_db)):
    copilot = CFOCopilotService(db)
    response_text = copilot.ask(payload.message)
    return {"response": response_text}

@router.post("/agent/analyze-and-propose")
def analyze_and_propose(db: Session = Depends(get_db)):
    agent = FinancialRescueAgent(db)
    proposal = agent.evaluate_and_create_rescue_plan()

    if not proposal:
        return {
            "success": False,
            "message": "No se detectó déficit activo o el saldo ya se encuentra protegido.",
        }

    sim = simulate_plan_solution(db, proposal.actions_payload)

    # Push to Telegram
    telegram_bot_service.send_rescue_alert(
        proposal_id=proposal.id,
        deficit_amount=proposal.projected_deficit,
        deficit_date_str=proposal.deficit_date.isoformat(),
        actions_list=proposal.actions_payload,
        new_min_balance=sim["new_minimum_balance"],
    )

    return {
        "success": True,
        "proposal": {
            "id": proposal.id,
            "title": proposal.title,
            "projected_deficit": proposal.projected_deficit,
            "deficit_date": proposal.deficit_date.isoformat(),
            "status": proposal.status,
            "confidence_score": proposal.confidence_score,
            "action_summary": proposal.action_summary,
            "actions_payload": proposal.actions_payload,
            "simulated_minimum_balance": sim["new_minimum_balance"],
        },
    }

@router.get("/agent/proposals/pending")
def get_pending_proposal(db: Session = Depends(get_db)):
    proposal = (
        db.query(AgentProposal)
        .filter(AgentProposal.status == "PENDING_APPROVAL")
        .order_by(AgentProposal.id.desc())
        .first()
    )
    if not proposal:
        return {"has_pending": False, "proposal": None}

    sim = simulate_plan_solution(db, proposal.actions_payload or [])
    return {
        "has_pending": True,
        "proposal": {
            "id": proposal.id,
            "title": proposal.title,
            "projected_deficit": proposal.projected_deficit,
            "deficit_date": proposal.deficit_date.isoformat(),
            "status": proposal.status,
            "confidence_score": proposal.confidence_score,
            "action_summary": proposal.action_summary,
            "actions_payload": proposal.actions_payload,
            "simulated_minimum_balance": sim["new_minimum_balance"],
        },
    }

@router.post("/agent/approve/{proposal_id}")
def approve_proposal(
    proposal_id: int,
    payload: ApprovalRequestDTO,
    db: Session = Depends(get_db)
):
    engine = ExecutionEngine(db)
    result = engine.approve_proposal(proposal_id, approved_by=payload.approved_by)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/agent/reject/{proposal_id}")
def reject_proposal(
    proposal_id: int,
    payload: RejectionRequestDTO,
    db: Session = Depends(get_db)
):
    engine = ExecutionEngine(db)
    result = engine.reject_proposal(
        proposal_id,
        reason=payload.reason,
        rejected_by=payload.rejected_by
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/ingest/csv")
async def ingest_csv_document(
    doc_type: str = "INVOICE",
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    content = await file.read()
    text = content.decode("utf-8")
    result = parse_and_ingest_csv(db, text, doc_type=doc_type.upper())
    return result

@router.get("/audit/logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()
    return {
        "logs": [
            {
                "id": l.id,
                "actor": l.actor,
                "action_type": l.action_type,
                "details": l.details,
                "meta": l.meta,
                "snowflake_synced": l.snowflake_synced,
                "created_at": l.created_at.isoformat() if l.created_at else None,
            }
            for l in logs
        ]
    }

@router.get("/outbox/emails")
def get_outbox_emails(limit: int = 20, db: Session = Depends(get_db)):
    emails = db.query(OutboxEmail).order_by(OutboxEmail.id.desc()).limit(limit).all()
    return {
        "emails": [
            {
                "id": e.id,
                "to_email": e.to_email,
                "subject": e.subject,
                "body_html": e.body_html,
                "body_text": e.body_text,
                "status": e.status,
                "dispatched_at": e.dispatched_at.isoformat() if e.dispatched_at else None,
            }
            for e in emails
        ]
    }

@router.post("/demo/reset")
def reset_demo(db: Session = Depends(get_db)):
    seed_demo_data(db, reset_existing=True)
    return {"success": True, "message": "Demo restablecido a su estado inicial de InnovaCloud Tech SAS."}
