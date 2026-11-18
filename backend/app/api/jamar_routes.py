from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timezone

from backend.app.database import get_db
from backend.app.models.jamar_models import (
    CityRegion, CategorySalesRecord, JamarStore, CredijamarLoanRecord, JamarSupplier, LocalAuditLog
)
from backend.app.models.financial import CompanyProfile, AgentProposal
from backend.app.agent.ai_gateway import ai_gateway

jamar_router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ApprovalRequest(BaseModel):
    approved_by: str = "ADMIN_WEB"

class RejectionRequest(BaseModel):
    reason: str
    rejected_by: str = "ADMIN_WEB"


@jamar_router.get("/summary")
def get_jamar_summary(db: Session = Depends(get_db)):
    """
    Retorna el estado consolidado de tesorería y retail de Muebles Jamar S.A.
    """
    profile = db.query(CompanyProfile).first()
    stores_count = db.query(JamarStore).count()
    cities = db.query(CityRegion).all()

    total_sales = sum(c.monthly_sales_cop for c in cities) if cities else 6141000000.0
    total_payroll = sum(c.total_payroll_cop for c in cities) if cities else 780000000.0
    
    total_credit = sum(c.credit_sales_amount_cop for c in cities) if cities else 4723180000.0
    total_cash = sum(c.cash_sales_amount_cop for c in cities) if cities else 1417820000.0
    credit_ratio = round((total_credit / total_sales) * 100, 1) if total_sales > 0 else 77.2
    cash_ratio = round((total_cash / total_sales) * 100, 1) if total_sales > 0 else 22.8

    pending_prop = db.query(AgentProposal).filter(AgentProposal.status == "PENDING_APPROVAL").first()
    has_deficit = pending_prop is not None

    return {
        "name": "Muebles Jamar S.A. & Credijamar",
        "currency": "COP",
        "current_balance": profile.current_cash_balance if profile else 1420000000.0,
        "safe_threshold": profile.safe_cash_threshold if profile else 600000000.0,
        "has_deficit": has_deficit,
        "first_deficit_date": "2026-11-28" if has_deficit else None,
        "days_until_deficit": 11 if has_deficit else None,
        "worst_deficit": -390000000.0 if has_deficit else 0.0,
        "minimum_balance": -390000000.0 if has_deficit else 195000000.0,
        "health_score": 54 if has_deficit else 94,
        "runway_days": 14 if has_deficit else 45,
        "burn_rate_daily": 48500000.0,
        "total_payroll": total_payroll,
        "total_sales_cop": total_sales,
        "national_credit_ratio": credit_ratio,
        "national_cash_ratio": cash_ratio,
        "active_stores_count": 12,
        "cendis_count": 2,
    }


@jamar_router.get("/cities")
def get_jamar_cities(db: Session = Depends(get_db)):
    """
    Retorna las 4 ciudades/regionales con sus métricas y ventas por categoría.
    """
    cities = db.query(CityRegion).all()
    result = []
    for c in cities:
        cats = [
            {
                "category": cat.category,
                "icon": cat.icon,
                "amount_cop": cat.amount_cop,
                "percentage": cat.percentage,
                "units_sold": cat.units_sold,
            }
            for cat in c.categories
        ]
        result.append({
            "id": c.id,
            "name": c.name,
            "department": c.department,
            "stores_count": c.stores_count,
            "total_payroll_cop": c.total_payroll_cop,
            "total_rent_cop": c.total_rent_cop,
            "local_suppliers_cop": c.local_suppliers_cop,
            "monthly_sales_cop": c.monthly_sales_cop,
            "sales_target_cop": c.sales_target_cop,
            "credit_sales_percentage": c.credit_sales_percentage,
            "cash_sales_percentage": c.cash_sales_percentage,
            "credit_sales_amount_cop": c.credit_sales_amount_cop,
            "cash_sales_amount_cop": c.cash_sales_amount_cop,
            "on_time_payment_rate": c.on_time_payment_rate,
            "early_arrears_rate": c.early_arrears_rate,
            "late_arrears_rate": c.late_arrears_rate,
            "early_arrears_amount_cop": c.early_arrears_amount_cop,
            "active_clients_count": c.active_clients_count,
            "categories_sales": cats,
        })
    return {"cities": result}


@jamar_router.get("/stores")
def get_jamar_stores(city_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Retorna las 14 sedes de Jamar con opción de filtrado por ciudad.
    """
    query = db.query(JamarStore)
    if city_id:
        query = query.filter(JamarStore.city_id == city_id)
    stores = query.all()

    return {
        "stores": [
            {
                "id": s.id,
                "code": s.code,
                "name": s.name,
                "city_id": s.city_id,
                "city_name": s.city.name if s.city else s.city_id,
                "address": s.address,
                "type": s.type,
                "area_sqm": s.area_sqm,
                "monthly_rent_cop": s.monthly_rent_cop,
                "monthly_sales_target_cop": s.monthly_sales_target_cop,
                "actual_sales_cop": s.actual_sales_cop,
                "credit_percentage": s.credit_percentage,
                "cash_percentage": s.cash_percentage,
                "monthly_credit_revenue_cop": s.monthly_credit_revenue_cop,
                "monthly_cash_revenue_cop": s.monthly_cash_revenue_cop,
                "credijamar_collection_rate": s.credijamar_collection_rate,
                "active_advisors_count": s.active_advisors_count,
                "is_profitable": s.is_profitable,
                "status": s.status,
            }
            for s in stores
        ]
    }


@jamar_router.get("/credijamar")
def get_credijamar_portfolio(db: Session = Depends(get_db)):
    """
    Retorna métricas consolidadas de la cartera de financiación Credijamar.
    """
    loans = db.query(CredijamarLoanRecord).all()
    total_active = 14250000000.0
    on_time = 12696000000.0
    early_arr = 895000000.0

    return {
        "total_active_loans_cop": total_active,
        "on_time_loans_cop": on_time,
        "on_time_rate": 0.891,
        "early_arrears_cop": early_arr,
        "early_arrears_clients_count": 2450,
        "mid_arrears_cop": 420000000.0,
        "late_arrears_cop": 239000000.0,
        "potential_rescue_injection_cop": 340000000.0,
    }


@jamar_router.get("/proposal/pending")
def get_pending_proposal(db: Session = Depends(get_db)):
    """
    Obtiene la propuesta de contingencia pendiente del Guardián.
    """
    prop = db.query(AgentProposal).filter(AgentProposal.status == "PENDING_APPROVAL").first()
    if not prop:
        return {"has_pending": False, "proposal": None}

    return {
        "has_pending": True,
        "proposal": {
            "id": prop.id,
            "title": prop.title,
            "projected_deficit": prop.projected_deficit,
            "deficit_date": str(prop.deficit_date),
            "status": prop.status,
            "confidence_score": prop.confidence_score,
            "action_summary": prop.action_summary,
            "simulated_minimum_balance": 195000000.0,
            "actions_payload": prop.actions_payload or [],
        }
    }


@jamar_router.post("/approve/{proposal_id}")
def approve_jamar_proposal(proposal_id: int, req: ApprovalRequest, db: Session = Depends(get_db)):
    """
    Human-in-the-Loop: Aprueba el plan de rescate en la base de datos local SQLite.
    1. Marca la propuesta como APROBADA.
    2. Aplica la prórroga contractual al proveedor de maderas en Galapa.
    3. Registra la auditoría inmutable localmente (sin Snowflake).
    """
    prop = db.query(AgentProposal).filter(AgentProposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada.")

    prop.status = "APPROVED"

    # Prórroga de madera en Galapa
    wood_supplier = db.query(JamarSupplier).filter(JamarSupplier.vendor_name.ilike("%Maderas del Darién%")).first()
    if wood_supplier:
        wood_supplier.status = "PRORROGADO"
        wood_supplier.effective_due_date = "2026-12-16"

    # Marcar ofertas de condonación de intereses a clientes de Credijamar en mora temprana
    db.query(CredijamarLoanRecord).filter(CredijamarLoanRecord.status == "MORA_1_15").update(
        {"interest_waive_offered": True}
    )

    sim_balance = 195000000.0
    # Auditoría Local
    audit = LocalAuditLog(
        actor=req.approved_by,
        action_type="RESCATE_APROBADO_JAMAR",
        action_summary=f"Aprobación del rescate #{prop.id}: Campaña Flash Credijamar + Prórroga de madera 18 días.",
        protected_balance_cop=sim_balance,
        details={"proposal_id": prop.id, "deficit_cured": prop.projected_deficit}
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": "Plan de rescate de Muebles Jamar aprobado y ejecutado en base de datos local.",
        "simulated_minimum_balance": sim_balance,
    }


@jamar_router.post("/reject/{proposal_id}")
def reject_jamar_proposal(proposal_id: int, req: RejectionRequest, db: Session = Depends(get_db)):
    """
    Rechaza la propuesta y almacena el motivo en la auditoría local.
    """
    prop = db.query(AgentProposal).filter(AgentProposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada.")

    prop.status = "REJECTED"

    audit = LocalAuditLog(
        actor=req.rejected_by,
        action_type="RESCATE_RECHAZADO_JAMAR",
        action_summary=f"Rechazo del rescate #{prop.id}. Motivo: {req.reason}",
        protected_balance_cop=0.0,
        details={"proposal_id": prop.id, "reason": req.reason}
    )
    db.add(audit)
    db.commit()

    return {"success": True, "message": "Propuesta rechazada."}


@jamar_router.post("/chat")
def chat_jamar_cfo(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Copiloto CFO Autónomo para Muebles Jamar alimentado por Groq 120B
    con contexto inyectado de tiendas, costos y cartera.
    """
    from backend.app.agent.jamar_copilot import JamarCFOCopilotService
    service = JamarCFOCopilotService(db)
    answer = service.ask(req.message)
    return {"answer": answer}
