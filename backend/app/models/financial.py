from datetime import datetime, date, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
    JSON,
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, default="InnovaCloud Tech SAS")
    current_cash_balance = Column(Float, default=5000.0)
    safe_cash_threshold = Column(Float, default=2000.0)
    monthly_burn_rate = Column(Float, default=14500.0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    role_title = Column(String(100), nullable=False)  # Tech Lead, Senior Backend, etc.
    email = Column(String(100), nullable=False)
    monthly_salary = Column(Float, nullable=False)
    benefits_cost = Column(Float, default=0.0)  # Parafiscales, salud, pension
    payment_cutoff_day = Column(Integer, default=30)  # Dia 15 o 30
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    category = Column(String(50), default="CLOUD_INFRASTRUCTURE")  # CLOUD_INFRASTRUCTURE, SAAS, FACILITIES, GENERAL
    relationship_status = Column(String(20), default="FLEXIBLE")  # FLEXIBLE, STRICT, CRITICAL
    daily_penalty_rate = Column(Float, default=0.0)
    grace_period_days = Column(Integer, default=15)
    created_at = Column(DateTime, default=utc_now)

    scheduled_payments = relationship("ScheduledPayment", back_populates="vendor", cascade="all, delete-orphan")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    contact_person = Column(String(100), nullable=True)
    liquidity_rating = Column(String(20), default="HIGH")  # HIGH, MEDIUM, LOW
    discount_responsiveness = Column(Float, default=0.85)  # Historical early-payment probability
    created_at = Column(DateTime, default=utc_now)

    invoices = relationship("Invoice", back_populates="customer", cascade="all, delete-orphan")

class ScheduledPayment(Base):
    __tablename__ = "scheduled_payments"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    description = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    scheduled_date = Column(Date, nullable=False)
    original_scheduled_date = Column(Date, nullable=False)
    status = Column(String(30), default="SCHEDULED")  # SCHEDULED, RESCHEDULED, PAID, CANCELLED
    category = Column(String(50), default="NON_CRITICAL")  # PAYROLL, CLOUD, SAAS, FACILITIES
    created_at = Column(DateTime, default=utc_now)

    vendor = relationship("Vendor", back_populates="scheduled_payments")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    invoice_number = Column(String(50), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    issue_date = Column(Date, nullable=False)
    original_due_date = Column(Date, nullable=False)
    effective_due_date = Column(Date, nullable=False)
    status = Column(String(30), default="PENDING")  # PENDING, PAID, DISCOUNT_OFFERED
    discount_offered = Column(Float, default=0.0)  # e.g. 0.02 (2%)
    paid_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    customer = relationship("Customer", back_populates="invoices")

class AgentProposal(Base):
    __tablename__ = "agent_proposals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    projected_deficit = Column(Float, nullable=False)
    deficit_date = Column(Date, nullable=False)
    status = Column(String(30), default="PENDING_APPROVAL")  # PENDING_APPROVAL, APPROVED, REJECTED
    confidence_score = Column(Float, default=0.92)
    action_summary = Column(Text, nullable=False)
    actions_payload = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    resolved_at = Column(DateTime, nullable=True)

    audit_logs = relationship("AuditLog", back_populates="proposal")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("agent_proposals.id"), nullable=True)
    actor = Column(String(50), nullable=False)  # AGENT, ADMIN_TELEGRAM, ADMIN_WEB
    action_type = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    meta = Column(JSON, nullable=True)
    snowflake_synced = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    proposal = relationship("AgentProposal", back_populates="audit_logs")

class LearningFeedback(Base):
    __tablename__ = "learning_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("agent_proposals.id"), nullable=True)
    decision = Column(String(20), nullable=False)  # APPROVED, REJECTED
    feedback_reason = Column(Text, nullable=True)
    learned_rule = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)

class OutboxEmail(Base):
    __tablename__ = "outbox_emails"

    id = Column(Integer, primary_key=True, index=True)
    to_email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    body_html = Column(Text, nullable=False)
    body_text = Column(Text, nullable=False)
    status = Column(String(20), default="DISPATCHED")  # PENDING, DISPATCHED, FAILED
    dispatched_at = Column(DateTime, default=utc_now)

class BusinessRule(Base):
    __tablename__ = "business_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String(100), unique=True, nullable=False)
    rule_category = Column(String(50), default="GENERAL")
    rule_value_json = Column(JSON, nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)
