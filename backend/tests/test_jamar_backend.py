import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.database import Base, get_db
from backend.app.main import app
from backend.app.services.seeder_jamar import seed_jamar_database
from backend.app.models.jamar_models import CityRegion, JamarStore, JamarSupplier

@pytest.fixture
def client():
    engine_test = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine_test)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)
    
    seed_session = TestingSessionLocal()
    seed_jamar_database(seed_session)
    seed_session.close()

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()

def test_jamar_summary_endpoint(client):
    response = client.get("/api/jamar/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Muebles Jamar S.A. & Credijamar"
    assert data["currency"] == "COP"
    assert data["current_balance"] == 1420000000.0
    assert data["national_credit_ratio"] > 70.0

def test_jamar_cities_endpoint(client):
    response = client.get("/api/jamar/cities")
    assert response.status_code == 200
    data = response.json()
    assert "cities" in data
    assert len(data["cities"]) == 4
    
    baq = next(c for c in data["cities"] if c["id"] == "barranquilla")
    assert baq["stores_count"] == 5
    assert baq["credit_sales_percentage"] == 78.0
    assert len(baq["categories_sales"]) == 4

def test_jamar_stores_endpoint(client):
    response = client.get("/api/jamar/stores")
    assert response.status_code == 200
    data = response.json()
    assert "stores" in data
    assert len(data["stores"]) == 14

    baq_stores = [s for s in data["stores"] if s["city_id"] == "barranquilla"]
    assert len(baq_stores) == 5

def test_jamar_credijamar_portfolio(client):
    response = client.get("/api/jamar/credijamar")
    assert response.status_code == 200
    data = response.json()
    assert data["total_active_loans_cop"] > 10000000000.0
    assert data["on_time_rate"] > 0.85

def test_jamar_rescue_approval_workflow(client):
    # 1. Get pending proposal
    prop_resp = client.get("/api/jamar/proposal/pending")
    assert prop_resp.status_code == 200
    prop_data = prop_resp.json()
    assert prop_data["has_pending"] is True
    prop_id = prop_data["proposal"]["id"]

    # 2. Approve proposal
    appr_resp = client.post(f"/api/jamar/approve/{prop_id}", json={"approved_by": "ADMIN_TEST"})
    assert appr_resp.status_code == 200
    assert appr_resp.json()["success"] is True

    # 3. Check that pending proposal is now resolved
    prop_after = client.get("/api/jamar/proposal/pending")
    assert prop_after.json()["has_pending"] is False

def test_jamar_cfo_chat(client):
    response = client.post("/api/jamar/chat", json={"message": "¿Podemos abrir una nueva sede en Montería?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["answer"]) > 20

def test_jamar_telegram_alert_formatting():
    from backend.app.services.telegram_bot import telegram_bot_service
    alert = telegram_bot_service.send_rescue_alert(
        proposal_id=99,
        deficit_amount=390000000.0,
        deficit_date_str="2026-11-28",
        actions_list=[
            {"reason": "Campaña Flash Credijamar mora temprana"},
            {"reason": "Prórroga 18 días factura Maderas del Darién Galapa"}
        ],
        new_min_balance=195000000.0,
        currency="COP",
    )
    assert alert["proposal_id"] == 99
    assert "MUEBLES JAMAR & CREDIJAMAR" in alert["message"]
    assert "390,000,000 COP" in alert["message"]
    assert "195,000,000 COP" in alert["message"]
    assert alert["inline_buttons"][0]["callback_data"] == "approve_jamar:99"

def test_jamar_telegram_commands():
    from backend.app.services.telegram_bot import telegram_bot_service
    from backend.app.models.financial import AgentProposal
    from backend.app.models.jamar_models import LocalAuditLog
    from backend.app.api.jamar_routes import execute_jamar_approval, execute_jamar_rejection
    
    engine_test = create_engine("sqlite:///:memory:", poolclass=StaticPool)
    Base.metadata.create_all(bind=engine_test)
    TestingSession = sessionmaker(bind=engine_test)
    session = TestingSession()
    seed_jamar_database(session)

    # Test /saldo
    saldo_reply = telegram_bot_service.handle_incoming_text_or_command(session, "/saldo")
    assert "ESTADO DE TESORERÍA — MUEBLES JAMAR S.A." in saldo_reply
    assert "1,420,000,000 COP" in saldo_reply

    # Test /nomina
    nomina_reply = telegram_bot_service.handle_incoming_text_or_command(session, "/nomina")
    assert "NÓMINA NACIONAL — MUEBLES JAMAR" in nomina_reply
    assert "1.200 trabajadores" in nomina_reply

    # Test /sedes
    sedes_reply = telegram_bot_service.handle_incoming_text_or_command(session, "/sedes")
    assert "RED DE TIENDAS MUEBLES JAMAR" in sedes_reply
    assert "Paloquemao" in sedes_reply or "Showroom" in sedes_reply

    # Test /credijamar
    credijamar_reply = telegram_bot_service.handle_incoming_text_or_command(session, "/credijamar")
    assert "ESTADO DE CARTERA — CREDIJAMAR" in credijamar_reply
    assert "14.250.000.000 COP" in credijamar_reply

    # Test /ciudades
    ciudades_reply = telegram_bot_service.handle_incoming_text_or_command(session, "/ciudades")
    assert "Barranquilla" in ciudades_reply
    assert "Bogotá" in ciudades_reply

    # Test Telegram Approval execution
    pending_prop = session.query(AgentProposal).filter(AgentProposal.status == "PENDING_APPROVAL").first()
    assert pending_prop is not None
    appr_res = execute_jamar_approval(session, pending_prop.id, approved_by="ADMIN_TELEGRAM")
    assert appr_res["success"] is True

    audit = session.query(LocalAuditLog).filter(LocalAuditLog.actor == "ADMIN_TELEGRAM").first()
    assert audit is not None
    assert audit.action_type == "RESCATE_APROBADO_JAMAR"
    session.close()
