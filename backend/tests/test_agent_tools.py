import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.services.seeder import seed_demo_data
from backend.app.agent.orchestrator import FinancialRescueAgent
from backend.app.agent.cfo_copilot import CFOCopilotService
from backend.app.agent.tools import (
    audit_payables_flexibility,
    audit_receivables_opportunities,
    simulate_plan_solution,
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

def test_audit_tools_protect_payroll_and_target_flexible(db_session):
    flexible_payables = audit_payables_flexibility(db_session)
    assert len(flexible_payables) > 0
    for p in flexible_payables:
        assert p["category"] in ["CLOUD_INFRASTRUCTURE", "SAAS"]
        assert p["category"] != "PAYROLL"

    opts = audit_receivables_opportunities(db_session)
    assert len(opts) > 0
    assert opts[0]["customer_name"] in ["Fintech Horizons Inc", "Banco Digital Latam"]

def test_rescue_agent_generates_valid_contingency_plan(db_session):
    agent = FinancialRescueAgent(db_session)
    proposal = agent.evaluate_and_create_rescue_plan()

    assert proposal is not None
    assert proposal.status == "PENDING_APPROVAL"
    assert proposal.projected_deficit > 0
    assert len(proposal.actions_payload) >= 2

    # Check simulated outcome
    sim = simulate_plan_solution(db_session, proposal.actions_payload)
    assert sim["has_deficit"] is False
    assert sim["new_minimum_balance"] >= 2000.0

def test_cfo_copilot_context_and_query(db_session):
    copilot = CFOCopilotService(db_session)
    context = copilot.get_live_context()

    assert context["total_payroll"] > 10000.0
    assert context["employees_count"] == 5

    # Test asking a question
    response = copilot.ask("¿Podemos contratar a un nuevo desarrollador?")
    assert len(response) > 20
