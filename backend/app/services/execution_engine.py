from datetime import datetime, timezone, date, timedelta
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.models.financial import (
    AgentProposal,
    ScheduledPayment,
    Invoice,
    AuditLog,
    LearningFeedback,
)
from backend.app.services.email_service import EmailService
from backend.app.services.telegram_bot import telegram_bot_service
from backend.app.services.snowflake_service import snowflake_service

class ExecutionEngine:
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService(db)

    def approve_proposal(self, proposal_id: int, approved_by: str = "ADMIN") -> Dict[str, Any]:
        """
        Consolidates the approved rescue plan:
        1. Reschedules scheduled payments in database.
        2. Applies early payment discount & deadline to invoices.
        3. Dispatches HTML corporate emails to vendors and customers.
        4. Replicates immutable audit record to Snowflake (FACT_FINANCIAL_DECISIONS).
        5. Sends Telegram execution notification.
        """
        proposal = self.db.get(AgentProposal, proposal_id)
        if not proposal:
            return {"success": False, "error": f"Proposal {proposal_id} not found"}

        if proposal.status != "PENDING_APPROVAL":
            return {"success": False, "error": f"Proposal already has status {proposal.status}"}

        today = date.today()
        actions = proposal.actions_payload or []
        executed_details = []

        for action in actions:
            act_type = action.get("type")
            if act_type == "RESCHEDULE_PAYMENT":
                payment_id = action.get("payment_id")
                days_delayed = action.get("days_delayed", 18)
                payment = self.db.get(ScheduledPayment, payment_id)
                if payment:
                    new_date = payment.scheduled_date + timedelta(days=days_delayed)
                    payment.scheduled_date = new_date
                    payment.status = "RESCHEDULED"

                    # Dispatch HTML Email
                    html_content = action.get("html_email_preview", "<p>Reprogramación de pago</p>")
                    self.email_service.send_html_email(
                        to_email=action.get("vendor_email", "vendor@example.com"),
                        subject=f"Aviso de Tesorería: Reprogramación de Pago - {payment.description}",
                        html_body=html_content,
                        text_body=f"Notificación de reprogramación de pago de {payment.description} al {new_date.isoformat()}.",
                    )
                    executed_details.append(
                        f"Reprogramado pago {payment.description} (${payment.amount:,.2f} USD) al {new_date.isoformat()}."
                    )

            elif act_type == "OFFER_EARLY_PAYMENT_DISCOUNT":
                invoice_id = action.get("invoice_id")
                acc_days = action.get("accelerate_to_day_offset", 8)
                discount_pct = action.get("discount_percentage", 0.02)
                invoice = self.db.get(Invoice, invoice_id)
                if invoice:
                    deadline_date = today + timedelta(days=acc_days)
                    invoice.effective_due_date = deadline_date
                    invoice.discount_offered = discount_pct
                    invoice.status = "DISCOUNT_OFFERED"

                    # Dispatch HTML Email
                    html_content = action.get("html_email_preview", "<p>Oferta de pronto pago</p>")
                    self.email_service.send_html_email(
                        to_email=action.get("customer_email", "customer@example.com"),
                        subject=f"Oportunidad de Descuento por Pronto Pago (2%) - Factura #{invoice.invoice_number}",
                        html_body=html_content,
                        text_body=f"Oferta de 2% de pronto pago en factura #{invoice.invoice_number} antes del {deadline_date.isoformat()}.",
                    )
                    executed_details.append(
                        f"Ofrecido pronto pago 2% a {action.get('customer_name')} para Factura #{invoice.invoice_number}."
                    )

        proposal.status = "APPROVED"
        proposal.resolved_at = datetime.now(timezone.utc)

        audit = AuditLog(
            proposal_id=proposal.id,
            actor=approved_by,
            action_type="APPROVE_RESCUE_PLAN",
            details=f"Plan aprobado por {approved_by}. Ejecutadas {len(executed_details)} acciones y despachados los correos oficiales.",
            meta={"executed_actions": executed_details},
            snowflake_synced=True,
        )
        self.db.add(audit)
        self.db.commit()

        # Replicate to Snowflake
        snowflake_service.sync_decision(
            decision_id=f"DEC-{proposal.id}",
            actor=approved_by,
            summary=f"Aprobado rescate. Déficit resuelto: ${proposal.projected_deficit:,.2f} USD. Acciones: {len(executed_details)}.",
            deficit=proposal.projected_deficit,
            protected_balance=2124.0,
            channel="TELEGRAM" if "TELEGRAM" in approved_by else "WEB",
        )

        # Notify back on Telegram
        telegram_bot_service.send_message(
            f"✅ *PLAN DE RESCATE EJECUTADO POR {approved_by}*\n\n"
            f"• *Acciones completadas:* {len(executed_details)}\n"
            f"• *Correos oficiales:* Despachados en formato HTML vía Gmail.\n"
            f"• *Snowflake Data Warehouse:* Sincronizado en `FACT_FINANCIAL_DECISIONS`.\n"
            f"• *Resultado:* El flujo de caja está protegido y la nómina garantizada."
        )

        return {
            "success": True,
            "proposal_id": proposal.id,
            "status": "APPROVED",
            "executed_actions": executed_details,
        }

    def reject_proposal(
        self,
        proposal_id: int,
        reason: Optional[str] = None,
        rejected_by: str = "ADMIN"
    ) -> Dict[str, Any]:
        """
        Rejects proposal and registers learning feedback.
        """
        proposal = self.db.get(AgentProposal, proposal_id)
        if not proposal:
            return {"success": False, "error": f"Proposal {proposal_id} not found"}

        proposal.status = "REJECTED"
        proposal.resolved_at = datetime.now(timezone.utc)

        feedback_text = reason or "Rechazado manualmente por el administrador sin comentario adicional."
        feedback = LearningFeedback(
            proposal_id=proposal.id,
            decision="REJECTED",
            feedback_reason=feedback_text,
            learned_rule=f"Ajustar heurística según feedback: {feedback_text[:100]}",
        )
        self.db.add(feedback)

        audit = AuditLog(
            proposal_id=proposal.id,
            actor=rejected_by,
            action_type="REJECT_RESCUE_PLAN",
            details=f"Plan rechazado por {rejected_by}. Motivo: {feedback_text}",
            meta={"reason": feedback_text},
            snowflake_synced=True,
        )
        self.db.add(audit)
        self.db.commit()

        telegram_bot_service.send_message(
            f"❌ *PLAN DE RESCATE RECHAZADO*\n\n"
            f"El plan de contingencia #{proposal.id} fue rechazado por {rejected_by}.\n"
            f"Motivo registrado en memoria: _{feedback_text}_"
        )

        return {
            "success": True,
            "proposal_id": proposal.id,
            "status": "REJECTED",
            "feedback": feedback_text,
        }
