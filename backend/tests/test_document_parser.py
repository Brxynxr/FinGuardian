import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.services.seeder import seed_demo_data
from backend.app.pipeline.document_parser import parse_and_ingest_csv, parse_and_ingest_json
from backend.app.models.financial import Invoice, ScheduledPayment

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

def test_parse_csv_invoice_ingestion(db_session):
    csv_data = """invoice_number,customer_name,amount,due_date
FAC-2026-999,Banco Digital Latam,5500.0,2026-12-15
"""
    result = parse_and_ingest_csv(db_session, csv_data, doc_type="INVOICE")
    assert result["success"] is True
    assert result["inserted_count"] == 1

    inv = db_session.query(Invoice).filter(Invoice.invoice_number == "FAC-2026-999").first()
    assert inv is not None
    assert inv.amount == 5500.0

def test_parse_json_payment_ingestion(db_session):
    json_data = [
        {
            "vendor_name": "AWS Cloud Infrastructure",
            "description": "Extra GPU Server for AI Training",
            "amount": 800.0,
            "scheduled_date": "2026-12-10",
            "category": "CLOUD_INFRASTRUCTURE"
        }
    ]
    result = parse_and_ingest_json(db_session, json_data, doc_type="PAYMENT")
    assert result["success"] is True
    assert result["inserted_count"] == 1

    payment = db_session.query(ScheduledPayment).filter(ScheduledPayment.description.contains("Extra GPU")).first()
    assert payment is not None
    assert payment.amount == 800.0
