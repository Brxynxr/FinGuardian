from datetime import date, timedelta
from typing import List, Optional, Dict, Tuple, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.models.financial import (
    CompanyProfile,
    Invoice,
    ScheduledPayment,
)

class DailyCashPoint(BaseModel):
    date: date
    day_offset: int
    inflow: float
    outflow: float
    net_change: float
    balance: float
    pessimistic_balance: float
    expected_balance: float
    optimistic_balance: float
    is_deficit: bool
    events: List[str]

class CashProjectionResult(BaseModel):
    initial_cash: float
    safe_cash_threshold: float
    days_ahead: int
    has_deficit: bool
    first_deficit_date: Optional[date] = None
    days_until_deficit: Optional[int] = None
    minimum_balance: float
    worst_deficit_amount: float
    health_score: int  # 0 to 100
    runway_days: int
    burn_rate_daily: float
    timeline: List[DailyCashPoint]

def calculate_cash_projection(
    db: Session,
    days_ahead: int = 40,
    simulation_overrides: Optional[Dict] = None
) -> CashProjectionResult:
    """
    Deterministic cash projection engine with probabilistic bands (Pessimistic, Expected, Optimistic).
    """
    company = db.query(CompanyProfile).first()
    initial_cash = company.current_cash_balance if company else 5000.0
    safe_threshold = company.safe_cash_threshold if company else 2000.0

    today = date.today()
    overrides = simulation_overrides or {}
    rescheduled_payments: Dict[int, date] = overrides.get("rescheduled_payments", {})
    early_invoices: Dict[int, Tuple[date, float]] = overrides.get("early_invoices", {})

    invoices = db.query(Invoice).filter(Invoice.status.in_(["PENDING", "DISCOUNT_OFFERED"])).all()
    payments = db.query(ScheduledPayment).filter(ScheduledPayment.status.in_(["SCHEDULED", "RESCHEDULED"])).all()

    daily_inflows: Dict[date, Tuple[float, List[str]]] = {}
    daily_outflows: Dict[date, Tuple[float, List[str]]] = {}

    for inv in invoices:
        eff_date = inv.effective_due_date
        effective_amount = inv.amount * (1.0 - inv.discount_offered)

        if inv.id in early_invoices:
            override_date, override_discount = early_invoices[inv.id]
            eff_date = override_date
            effective_amount = inv.amount * (1.0 - override_discount)

        if eff_date not in daily_inflows:
            daily_inflows[eff_date] = (0.0, [])
        cur_amt, events = daily_inflows[eff_date]
        daily_inflows[eff_date] = (
            cur_amt + effective_amount,
            events + [f"Cobro Factura #{inv.invoice_number} ({inv.customer.name}): +${effective_amount:,.2f}"]
        )

    for p in payments:
        p_date = p.scheduled_date
        if p.id in rescheduled_payments:
            p_date = rescheduled_payments[p.id]

        if p_date not in daily_outflows:
            daily_outflows[p_date] = (0.0, [])
        cur_amt, events = daily_outflows[p_date]
        daily_outflows[p_date] = (
            cur_amt + p.amount,
            events + [f"Pago {p.description}: -${p.amount:,.2f}"]
        )

    running_balance = initial_cash
    timeline: List[DailyCashPoint] = []
    has_deficit = False
    first_deficit_date: Optional[date] = None
    days_until_deficit: Optional[int] = None
    min_balance = running_balance
    total_outflows = 0.0

    for offset in range(days_ahead + 1):
        cur_date = today + timedelta(days=offset)
        inflow, in_events = daily_inflows.get(cur_date, (0.0, []))
        outflow, out_events = daily_outflows.get(cur_date, (0.0, []))
        total_outflows += outflow

        net = inflow - outflow
        running_balance += net

        if running_balance < min_balance:
            min_balance = running_balance

        is_def = running_balance < 0
        if is_def and not has_deficit:
            has_deficit = True
            first_deficit_date = cur_date
            days_until_deficit = offset

        # Probabilistic bands
        pessimistic = running_balance * 0.95 if running_balance > 0 else running_balance * 1.05
        expected = running_balance
        optimistic = running_balance * 1.05 if running_balance > 0 else running_balance * 0.95

        timeline.append(
            DailyCashPoint(
                date=cur_date,
                day_offset=offset,
                inflow=round(inflow, 2),
                outflow=round(outflow, 2),
                net_change=round(net, 2),
                balance=round(running_balance, 2),
                pessimistic_balance=round(pessimistic, 2),
                expected_balance=round(expected, 2),
                optimistic_balance=round(optimistic, 2),
                is_deficit=is_def,
                events=in_events + out_events,
            )
        )

    worst_deficit = abs(min_balance) if min_balance < 0 else 0.0
    daily_burn = total_outflows / (days_ahead + 1) if (days_ahead + 1) > 0 else 0.0
    runway = days_until_deficit if days_until_deficit is not None else 60

    # Calculate Health Score (0-100)
    if has_deficit:
        score = max(10, int(35 - (worst_deficit / 200)))
    elif min_balance < safe_threshold:
        score = int(50 + (min_balance / safe_threshold) * 20)
    else:
        score = min(100, int(75 + (min_balance / safe_threshold) * 12))

    return CashProjectionResult(
        initial_cash=initial_cash,
        safe_cash_threshold=safe_threshold,
        days_ahead=days_ahead,
        has_deficit=has_deficit,
        first_deficit_date=first_deficit_date,
        days_until_deficit=days_until_deficit,
        minimum_balance=round(min_balance, 2),
        worst_deficit_amount=round(worst_deficit, 2),
        health_score=score,
        runway_days=runway,
        burn_rate_daily=round(daily_burn, 2),
        timeline=timeline,
    )
