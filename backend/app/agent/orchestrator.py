from datetime import date, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from backend.app.models.financial import (
    CompanyProfile,
    AgentProposal,
    AuditLog,
)
from backend.app.pipeline.forecaster import calculate_cash_projection
from backend.app.agent.tools import (
    audit_payables_flexibility,
    audit_receivables_opportunities,
    simulate_plan_solution,
    build_corporate_html_email,
)
from backend.app.agent.ai_gateway import ai_gateway

class FinancialRescueAgent:
    def __init__(self, db: Session):
        self.db = db

    def evaluate_and_create_rescue_plan(self) -> Optional[AgentProposal]:
        """
        Main autonomous reasoning and contingency protocol.
        1. Analyzes deterministic forecast.
        2. Solves minimal action set using vendor grace periods & customer pronto pago.
        3. Generates rich executive reasoning using Groq (Key 1).
        4. Prepares HTML emails and proposal in PENDING_APPROVAL state.
        """
        company = self.db.query(CompanyProfile).first()
        safe_threshold = company.safe_cash_threshold if company else 2000.0

        forecast = calculate_cash_projection(self.db, days_ahead=40)
        if not forecast.has_deficit:
            return None

        flexible_payables = audit_payables_flexibility(self.db)
        receivable_opts = audit_receivables_opportunities(self.db)

        selected_actions: List[Dict[str, Any]] = []

        # 1. Early receivables acceleration with customer
        if receivable_opts:
            top_rec = receivable_opts[0]
            action_early = {
                "type": "OFFER_EARLY_PAYMENT_DISCOUNT",
                "invoice_id": top_rec["invoice_id"],
                "invoice_number": top_rec["invoice_number"],
                "customer_name": top_rec["customer_name"],
                "customer_email": top_rec["customer_email"],
                "discount_percentage": 0.02,
                "accelerate_to_day_offset": 8,
                "expected_cash_inflow": top_rec["potential_cash_inflow"],
                "reason": (
                    f"Ofrecer 2% pronto pago a {top_rec['customer_name']}. "
                    f"Cliente con calificación {top_rec['liquidity_rating']} y {int(top_rec['discount_responsiveness']*100)}% "
                    f"probabilidad histórica en Snowflake, adelantando +${top_rec['potential_cash_inflow']:,.2f} USD."
                ),
                "html_email_preview": build_corporate_html_email("CUSTOMER_DISCOUNT", {
                    "customer_name": top_rec["customer_name"],
                    "invoice_number": top_rec["invoice_number"],
                    "original_amount": top_rec["original_amount"],
                    "discount_percentage": 0.02,
                    "deadline_date": (date.today() + timedelta(days=8)).isoformat(),
                }),
            }
            selected_actions.append(action_early)

        # 2. Reschedule flexible payments (AWS & GrowthMedia)
        for pay in flexible_payables:
            days_delay = 18
            new_date = (date.today() + timedelta(days=days_delay + int(pay["current_scheduled_date"].split("-")[-1]) - date.today().day)).isoformat() if "-" in pay["current_scheduled_date"] else (date.today() + timedelta(days=25)).isoformat()
            
            action_resched = {
                "type": "RESCHEDULE_PAYMENT",
                "payment_id": pay["payment_id"],
                "description": pay["description"],
                "vendor_name": pay["vendor_name"],
                "vendor_email": pay["vendor_email"],
                "amount": pay["amount"],
                "days_delayed": days_delay,
                "reason": (
                    f"Reprogramar pago de ${pay['amount']:,.2f} USD a {pay['vendor_name']} (+{days_delay} días). "
                    f"Proveedor en categoría {pay['vendor_relationship']} con {pay['grace_period_days']} días de gracia en Snowflake."
                ),
                "html_email_preview": build_corporate_html_email("VENDOR_RESCHEDULE", {
                    "vendor_name": pay["vendor_name"],
                    "description": pay["description"],
                    "amount": pay["amount"],
                    "new_date": (date.today() + timedelta(days=26)).isoformat(),
                }),
            }
            selected_actions.append(action_resched)

            sim_check = simulate_plan_solution(self.db, selected_actions)
            if not sim_check["has_deficit"] and sim_check["new_minimum_balance"] >= safe_threshold:
                break

        sim_final = simulate_plan_solution(self.db, selected_actions)

        # Synthesize executive summary using Groq
        groq_reasoning = ai_gateway.generate_decision_reasoning({
            "projected_deficit": forecast.worst_deficit_amount,
            "deficit_date": forecast.first_deficit_date.isoformat() if forecast.first_deficit_date else "en 11 días",
            "actions_summary": "\n".join([f"• {a['reason']}" for a in selected_actions]),
        })

        proposal = AgentProposal(
            title=f"Plan de Contingencia de Liquidez: Déficit -${forecast.worst_deficit_amount:,.2f} USD",
            projected_deficit=forecast.worst_deficit_amount,
            deficit_date=forecast.first_deficit_date or date.today() + timedelta(days=11),
            status="PENDING_APPROVAL",
            confidence_score=0.94,
            action_summary=groq_reasoning,
            actions_payload=selected_actions,
        )
        self.db.add(proposal)
        self.db.flush()

        audit = AuditLog(
            proposal_id=proposal.id,
            actor="FINANCIAL_AGENT_GROQ",
            action_type="GENERATE_RESCUE_PROPOSAL",
            details=f"Propuesto plan con {len(selected_actions)} acciones. Saldo mínimo protegido en ${sim_final['new_minimum_balance']:,.2f} USD.",
            meta={
                "projected_deficit": forecast.worst_deficit_amount,
                "protected_min_balance": sim_final["new_minimum_balance"],
                "actions_count": len(selected_actions),
            },
        )
        self.db.add(audit)
        self.db.commit()

        return proposal
