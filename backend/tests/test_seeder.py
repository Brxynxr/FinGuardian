import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.services.seeder import seed_demo_data
from backend.app.models.financial import (
    CompanyProfile,
    Employee,
    Vendor,
    Customer,
    ScheduledPayment,
    Invoice,
)

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    seed_demo_data(session)
    try:
        yield session
    finally:
        session.close()

def test_seeder_populates_full_360_system(db_session):
    company = db_session.query(CompanyProfile).first()
    assert company.name == "InnovaCloud Tech SAS"
    assert company.current_cash_balance == 5000.0

    employees = db_session.query(Employee).all()
    assert len(employees) == 5

    vendors = db_session.query(Vendor).all()
    assert len(vendors) == 5

    customers = db_session.query(Customer).all()
    assert len(customers) == 3

    payments = db_session.query(ScheduledPayment).all()
    assert len(payments) == 5

    invoices = db_session.query(Invoice).all()
    assert len(invoices) == 3
