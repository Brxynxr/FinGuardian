import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.models.financial import (
    CompanyProfile,
    Employee,
    Vendor,
    Customer,
    ScheduledPayment,
    Invoice,
    BusinessRule,
)

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_company_profile_creation(db_session):
    company = CompanyProfile(name="InnovaCloud Tech SAS", current_cash_balance=5000.0)
    db_session.add(company)
    db_session.commit()
    assert company.id is not None
    assert company.name == "InnovaCloud Tech SAS"

def test_employee_and_business_rules(db_session):
    emp = Employee(
        full_name="Carlos Mendoza",
        role_title="Tech Lead",
        email="carlos@innovacloud.tech",
        monthly_salary=3200.0,
    )
    rule = BusinessRule(
        rule_name="PAYROLL_DAY",
        rule_value_json={"day": 30},
        description="Payroll cutoff",
    )
    db_session.add_all([emp, rule])
    db_session.commit()

    assert emp.id is not None
    assert rule.id is not None
    assert rule.rule_value_json["day"] == 30
