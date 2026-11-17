from typing import Dict, Any
from sqlalchemy.orm import Session

from backend.app.models.financial import (
    CompanyProfile,
    Employee,
    ScheduledPayment,
    Invoice,
)
from backend.app.pipeline.forecaster import calculate_cash_projection
from backend.app.agent.ai_gateway import ai_gateway

class CFOCopilotService:
    def __init__(self, db: Session):
        self.db = db

    def get_live_context(self) -> Dict[str, Any]:
        company = self.db.query(CompanyProfile).first()
        employees = self.db.query(Employee).filter(Employee.is_active == True).all()
        total_payroll = sum(e.monthly_salary + e.benefits_cost for e in employees)

        forecast = calculate_cash_projection(self.db, days_ahead=40)

        return {
            "company_name": company.name if company else "InnovaCloud Tech SAS",
            "current_balance": company.current_cash_balance if company else 5000.0,
            "safe_threshold": company.safe_cash_threshold if company else 2000.0,
            "total_payroll": total_payroll,
            "employees_count": len(employees),
            "health_score": forecast.health_score,
            "runway_days": forecast.runway_days,
            "has_deficit": forecast.has_deficit,
            "worst_deficit": forecast.worst_deficit_amount,
        }

    def ask(self, user_query: str) -> str:
        context = self.get_live_context()
        return ai_gateway.chat_with_copilot(user_query, context)
