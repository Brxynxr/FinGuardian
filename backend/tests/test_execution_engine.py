import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.services.seeder import seed_demo_data
from backend.app.agent.orchestrator import FinancialRescueAgent
from backend.app.services.execution_engine import ExecutionEngine
from backend.app.models.financial import (
    ScheduledPayment,
    Invoice,
    OutboxEmail,
    AuditLog,
    LearningFeedback,
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

def test_execution_engine_approval_commits_and_dispatches(db_session):
    agent = FinancialRescueAgent(db_session)
    proposal = agent.evaluate_and_create_rescue_plan()
    assert proposal.status == "PENDING_APPROVAL"

    engine = ExecutionEngine(db_session)
    result = engine.approve_proposal(proposal.id, approved_by="TEST_ADMIN")

    assert result["success"] is True
    assert proposal.status == "APPROVED"
    assert proposal.resolved_at is not None

    emails = db_session.query(OutboxEmail).all()
    assert len(emails) >= 2
    for email in emails:
        assert email.status == "DISPATCHED"
        assert "<html>" in email.body_html.lower()

    audit = db_session.query(AuditLog).filter(AuditLog.action_type == "APPROVE_RESCUE_PLAN").first()
    assert audit is not None
    assert audit.actor == "TEST_ADMIN"

def test_execution_engine_rejection_stores_learning(db_session):
    agent = FinancialRescueAgent(db_session)
    proposal = agent.evaluate_and_create_rescue_plan()

    engine = ExecutionEngine(db_session)
    result = engine.reject_proposal(
        proposal.id,
        reason="Preferimos no reprogramar AWS este mes.",
        rejected_by="TEST_ADMIN"
    )

    assert result["success"] is True
    assert proposal.status == "REJECTED"

    feedback = db_session.query(LearningFeedback).filter(LearningFeedback.proposal_id == proposal.id).first()
    assert feedback is not None
    assert "AWS" in feedback.feedback_reason
