from datetime import date, datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CompanySummaryDTO(BaseModel):
    name: str
    current_balance: float
    safe_threshold: float
    has_deficit: bool
    first_deficit_date: Optional[date] = None
    days_until_deficit: Optional[int] = None
    worst_deficit: float
    minimum_balance: float
    health_score: int
    runway_days: int
    burn_rate_daily: float
    total_payroll: float

class TimelinePointDTO(BaseModel):
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

class ProjectionResponseDTO(BaseModel):
    has_deficit: bool
    minimum_balance: float
    health_score: int
    timeline: List[TimelinePointDTO]

class EmployeeDTO(BaseModel):
    id: int
    full_name: str
    role_title: str
    email: str
    monthly_salary: float
    benefits_cost: float
    payment_cutoff_day: int
    is_active: bool

class CreateEmployeeDTO(BaseModel):
    full_name: str
    role_title: str
    email: str
    monthly_salary: float
    benefits_cost: Optional[float] = 0.0
    payment_cutoff_day: Optional[int] = 30

class ChatRequestDTO(BaseModel):
    message: str

class ApprovalRequestDTO(BaseModel):
    approved_by: str = "ADMIN_WEB"

class RejectionRequestDTO(BaseModel):
    reason: str
    rejected_by: str = "ADMIN_WEB"
