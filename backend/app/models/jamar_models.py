from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

class CityRegion(Base):
    __tablename__ = "jamar_cities"

    id = Column(String(50), primary_key=True) # e.g. 'barranquilla'
    name = Column(String(120), nullable=False)
    department = Column(String(120), nullable=False)
    stores_count = Column(Integer, default=0)
    total_payroll_cop = Column(Float, default=0.0)
    total_rent_cop = Column(Float, default=0.0)
    local_suppliers_cop = Column(Float, default=0.0)
    monthly_sales_cop = Column(Float, default=0.0)
    sales_target_cop = Column(Float, default=0.0)
    
    # Mix de ingresos
    credit_sales_percentage = Column(Float, default=75.0)
    cash_sales_percentage = Column(Float, default=25.0)
    credit_sales_amount_cop = Column(Float, default=0.0)
    cash_sales_amount_cop = Column(Float, default=0.0)
    
    # Cartera Credijamar
    on_time_payment_rate = Column(Float, default=90.0)
    early_arrears_rate = Column(Float, default=7.0)
    late_arrears_rate = Column(Float, default=2.0)
    early_arrears_amount_cop = Column(Float, default=0.0)
    active_clients_count = Column(Integer, default=0)

    # Relationships
    stores = relationship("JamarStore", back_populates="city", cascade="all, delete-orphan")
    categories = relationship("CategorySalesRecord", back_populates="city", cascade="all, delete-orphan")


class CategorySalesRecord(Base):
    __tablename__ = "jamar_category_sales"

    id = Column(Integer, primary_key=True, autoincrement=True)
    city_id = Column(String(50), ForeignKey("jamar_cities.id"), nullable=False)
    category = Column(String(100), nullable=False) # 'Salas & Sofás', 'Alcobas & Cuartos', etc.
    icon = Column(String(20), default="🛋️")
    amount_cop = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    units_sold = Column(Integer, default=0)

    city = relationship("CityRegion", back_populates="categories")


class JamarStore(Base):
    __tablename__ = "jamar_stores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(20), unique=True, nullable=False) # 'BAQ-72'
    name = Column(String(150), nullable=False)
    city_id = Column(String(50), ForeignKey("jamar_cities.id"), nullable=False)
    address = Column(String(200), nullable=False)
    type = Column(String(50), default="SHOWROOM") # 'SHOWROOM' | 'CENDIS_FABRICA'
    area_sqm = Column(Float, default=0.0)
    monthly_rent_cop = Column(Float, default=0.0)
    monthly_sales_target_cop = Column(Float, default=0.0)
    actual_sales_cop = Column(Float, default=0.0)
    
    # Desglose de ingresos por sede
    credit_percentage = Column(Float, default=75.0)
    cash_percentage = Column(Float, default=25.0)
    monthly_credit_revenue_cop = Column(Float, default=0.0)
    monthly_cash_revenue_cop = Column(Float, default=0.0)
    
    credijamar_collection_rate = Column(Float, default=0.90)
    active_advisors_count = Column(Integer, default=15)
    is_profitable = Column(Boolean, default=True)
    status = Column(String(50), default="OPERATIVA")

    city = relationship("CityRegion", back_populates="stores")


class CredijamarLoanRecord(Base):
    __tablename__ = "credijamar_loans"

    id = Column(Integer, primary_key=True, autoincrement=True)
    loan_code = Column(String(50), unique=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    customer_id_doc = Column(String(50), nullable=False)
    city_id = Column(String(50), nullable=False)
    store_code = Column(String(20), nullable=False)
    product_category = Column(String(100), nullable=False)
    total_loan_amount_cop = Column(Float, nullable=False)
    installment_amount_cop = Column(Float, nullable=False)
    due_date = Column(String(20), nullable=False)
    status = Column(String(50), default="AL_DIA") # 'AL_DIA', 'MORA_1_15', 'MORA_MAS_60', 'PAGADO'
    days_overdue = Column(Integer, default=0)
    interest_waive_offered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class JamarSupplier(Base):
    __tablename__ = "jamar_suppliers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_name = Column(String(150), nullable=False)
    city_id = Column(String(50), default="barranquilla")
    category = Column(String(50), nullable=False) # 'MADERA', 'ESPUMA', 'FLETES', 'ARRIENDO'
    invoice_number = Column(String(50), nullable=False)
    amount_due_cop = Column(Float, nullable=False)
    original_due_date = Column(String(20), nullable=False)
    effective_due_date = Column(String(20), nullable=False)
    grace_period_days = Column(Integer, default=15)
    status = Column(String(50), default="PROGRAMADO") # 'PROGRAMADO', 'PRORROGADO', 'PAGADO'


class LocalAuditLog(Base):
    __tablename__ = "jamar_local_audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    actor = Column(String(50), default="ADMIN_WEB")
    action_type = Column(String(100), nullable=False)
    action_summary = Column(Text, nullable=False)
    protected_balance_cop = Column(Float, default=0.0)
    details = Column(JSON, nullable=True)
