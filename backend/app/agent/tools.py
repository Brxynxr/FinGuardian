from datetime import date, timedelta
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session

from backend.app.models.financial import (
    ScheduledPayment,
    Vendor,
    Invoice,
    Customer,
    Employee,
)
from backend.app.pipeline.forecaster import calculate_cash_projection

def audit_payables_flexibility(db: Session) -> List[Dict[str, Any]]:
    """
    Evaluates all upcoming scheduled payments and identifies those belonging
    to flexible service vendors (AWS, SaaS) that can be rescheduled within grace periods.
    Payroll and statutory tax payments are strictly protected and never delayed.
    """
    today = date.today()
    payments = (
        db.query(ScheduledPayment)
        .join(Vendor)
        .filter(
            ScheduledPayment.status == "SCHEDULED",
            ScheduledPayment.scheduled_date >= today,
            Vendor.relationship_status == "FLEXIBLE",
            ScheduledPayment.category.in_(["CLOUD_INFRASTRUCTURE", "SAAS"]),
        )
        .order_by(ScheduledPayment.amount.desc())
        .all()
    )

    flexible_items = []
    for p in payments:
        flexible_items.append({
            "payment_id": p.id,
            "vendor_id": p.vendor.id,
            "vendor_name": p.vendor.name,
            "vendor_email": p.vendor.email,
            "vendor_relationship": p.vendor.relationship_status,
            "description": p.description,
            "amount": p.amount,
            "current_scheduled_date": p.scheduled_date.isoformat(),
            "grace_period_days": p.vendor.grace_period_days,
            "daily_penalty_rate": p.vendor.daily_penalty_rate,
            "category": p.category,
        })
    return flexible_items

def audit_receivables_opportunities(db: Session) -> List[Dict[str, Any]]:
    """
    Finds corporate clients with pending invoices who have high historical liquidity
    and are likely to accept an early payment discount (2%).
    """
    today = date.today()
    invoices = (
        db.query(Invoice)
        .join(Customer)
        .filter(
            Invoice.status == "PENDING",
            Invoice.effective_due_date >= today + timedelta(days=15),
            Customer.liquidity_rating.in_(["HIGH", "MEDIUM"]),
        )
        .order_by(Customer.discount_responsiveness.desc(), Invoice.amount.desc())
        .all()
    )

    opportunities = []
    for inv in invoices:
        discount_rate = 0.02  # 2%
        potential_cash = inv.amount * (1.0 - discount_rate)
        opportunities.append({
            "invoice_id": inv.id,
            "invoice_number": inv.invoice_number,
            "customer_id": inv.customer.id,
            "customer_name": inv.customer.name,
            "customer_email": inv.customer.email,
            "liquidity_rating": inv.customer.liquidity_rating,
            "discount_responsiveness": inv.customer.discount_responsiveness,
            "original_amount": inv.amount,
            "recommended_discount": discount_rate,
            "potential_cash_inflow": round(potential_cash, 2),
            "original_due_date": inv.effective_due_date.isoformat(),
            "target_accelerated_days": 8,
        })
    return opportunities

def simulate_plan_solution(db: Session, actions_payload: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Runs deterministic simulation applying candidate actions to verify cash recovery.
    """
    today = date.today()
    rescheduled_payments: Dict[int, date] = {}
    early_invoices: Dict[int, Tuple[date, float]] = {}

    for action in actions_payload:
        act_type = action.get("type")
        if act_type == "RESCHEDULE_PAYMENT":
            p_id = action.get("payment_id")
            days_to_add = action.get("days_delayed", 18)
            orig_p = db.get(ScheduledPayment, p_id)
            if orig_p:
                rescheduled_payments[p_id] = orig_p.scheduled_date + timedelta(days=days_to_add)
        elif act_type == "OFFER_EARLY_PAYMENT_DISCOUNT":
            inv_id = action.get("invoice_id")
            acc_days = action.get("accelerate_to_day_offset", 8)
            disc = action.get("discount_percentage", 0.02)
            early_invoices[inv_id] = (today + timedelta(days=acc_days), disc)

    overrides = {
        "rescheduled_payments": rescheduled_payments,
        "early_invoices": early_invoices,
    }

    result = calculate_cash_projection(db, days_ahead=40, simulation_overrides=overrides)
    return {
        "has_deficit": result.has_deficit,
        "new_minimum_balance": result.minimum_balance,
        "new_worst_deficit": result.worst_deficit_amount,
        "new_health_score": result.health_score,
        "timeline": [t.model_dump() for t in result.timeline],
    }

def build_corporate_html_email(template_type: str, context: Dict[str, Any]) -> str:
    """
    Renders clean, modern, responsive HTML corporate email.
    """
    if template_type == "VENDOR_RESCHEDULE":
        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }}
    .header {{ background: #0f172a; padding: 24px; color: #ffffff; }}
    .header h1 {{ margin: 0; font-size: 20px; font-weight: 600; }}
    .header p {{ margin: 4px 0 0; font-size: 13px; color: #94a3b8; }}
    .content {{ padding: 28px; color: #334155; line-height: 1.6; font-size: 14px; }}
    .card {{ background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px; }}
    .footer {{ background: #f8fafc; padding: 20px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>InnovaCloud Tech SAS</h1>
      <p>Departamento de Tesorería & Finanzas Corporativas</p>
    </div>
    <div class="content">
      <p>Estimado equipo de <strong>{context.get('vendor_name', 'Proveedor')}</strong>,</p>
      <p>Esperamos que este mensaje les encuentre muy bien.</p>
      <p>Nos comunicamos para notificar la programación oficial del pago correspondiente a los servicios prestados de acuerdo con nuestras políticas comerciales:</p>
      <div class="card">
        <p style="margin: 0 0 8px;"><strong>Concepto:</strong> {context.get('description', '')}</p>
        <p style="margin: 0 0 8px;"><strong>Importe a Transferir:</strong> <span style="font-size: 16px; color: #0f172a; font-weight: 700;">${context.get('amount', 0):,.2f} USD</span></p>
        <p style="margin: 0;"><strong>Nueva Fecha de Desembolso:</strong> <span style="color: #2563eb; font-weight: 600;">{context.get('new_date', '')}</span></p>
      </div>
      <p>Esta reprogramación se encuentra amparada dentro del período de gracia contractual acordado. Agradecemos su valiosa comprensión y alianza estratégica.</p>
      <p>Cordialmente,<br><strong>Gerencia de Tesorería</strong><br>InnovaCloud Tech SAS</p>
    </div>
    <div class="footer">
      Este es un comunicado oficial emitido por el Sistema Autónomo FinGuardian AI en nombre de InnovaCloud Tech SAS.
    </div>
  </div>
</body>
</html>"""

    elif template_type == "CUSTOMER_DISCOUNT":
        original_amt = context.get('original_amount', 0.0)
        disc_pct = context.get('discount_percentage', 0.02)
        disc_amt = original_amt * disc_pct
        final_amt = original_amt - disc_amt
        pct_int = int(disc_pct * 100)

        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }}
    .header {{ background: #064e3b; padding: 24px; color: #ffffff; }}
    .header h1 {{ margin: 0; font-size: 20px; font-weight: 600; }}
    .header p {{ margin: 4px 0 0; font-size: 13px; color: #6ee7b7; }}
    .content {{ padding: 28px; color: #334155; line-height: 1.6; font-size: 14px; }}
    .card {{ background: #ecfdf5; border-left: 4px solid #10b981; padding: 18px; margin: 20px 0; border-radius: 4px; }}
    .btn {{ display: inline-block; background: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px; }}
    .footer {{ background: #f8fafc; padding: 20px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>InnovaCloud Tech SAS</h1>
      <p>Beneficio Financiero Preferencial — Facturación B2B</p>
    </div>
    <div class="content">
      <p>Estimado equipo de <strong>{context.get('customer_name', 'Cliente')}</strong>,</p>
      <p>Como reconocimiento a su excelencia operativa y estrecha relación estratégica con InnovaCloud Tech, les presentamos una oportunidad exclusiva de ahorro financiero por <strong>Pronto Pago del {pct_int}%</strong> sobre la siguiente factura:</p>
      <div class="card">
        <p style="margin: 0 0 6px;"><strong>Factura N°:</strong> {context.get('invoice_number', '')}</p>
        <p style="margin: 0 0 6px;"><strong>Importe Original:</strong> ${original_amt:,.2f} USD</p>
        <p style="margin: 0 0 6px; color: #047857;"><strong>Descuento por Pronto Pago ({pct_int}%):</strong> -${disc_amt:,.2f} USD</p>
        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #064e3b;"><strong>Monto Preferencial con Descuento:</strong> ${final_amt:,.2f} USD</p>
      </div>
      <p>Para aplicar este descuento preferencial, la transferencia bancaria debe realizarse antes del <strong>{context.get('deadline_date', '')}</strong> usando la referencia <code>{context.get('invoice_number', '')}-DESC</code>.</p>
      <p>Quedamos a su completa disposición para cualquier inquietud o coordinación bancaria.</p>
      <p>Cordialmente,<br><strong>Dirección Financiera & Cobranzas</strong><br>InnovaCloud Tech SAS</p>
    </div>
    <div class="footer">
      InnovaCloud Tech SAS • NIT 901.442.189-4 • Medellín, Colombia.
    </div>
  </div>
</body>
</html>"""

    return "<p>Notificación de InnovaCloud Tech SAS</p>"
