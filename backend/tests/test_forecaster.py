import pytest
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.services.seeder import seed_demo_data
from backend.app.pipeline.forecaster import calculate_cash_projection, CashProjectionResult

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

def test_forecaster_detects_deficit_and_computes_health_score(db_session):
    result: CashProjectionResult = calculate_cash_projection(db_session, days_ahead=40)

    assert result.initial_cash == 5000.0
    assert result.has_deficit is True
    assert result.first_deficit_date is not None
    # Deficit occurs around day 11 when $650 SaaS payment is made with low balance
    assert result.worst_deficit_amount > 0
    # Health score is degraded (< 50) when deficit is impending
    assert result.health_score < 60
    assert result.runway_days <= 14
    assert len(result.timeline) == 41

def test_forecaster_probabilistic_scenarios(db_session):
    today = date.today()
    overrides = {
        "rescheduled_payments": {
            2: today + timedelta(days=27),  # AWS Cloud
            3: today + timedelta(days=28),  # Growth Media
        },
        "early_invoices": {
            1: (today + timedelta(days=8), 0.02)  # Banco Digital Latam pays day 8 with 2% discount
        }
    }
    result: CashProjectionResult = calculate_cash_projection(
        db_session, days_ahead=40, simulation_overrides=overrides
    )
    assert result.has_deficit is False
    assert result.minimum_balance >= 2000.0
    assert result.health_score >= 80
