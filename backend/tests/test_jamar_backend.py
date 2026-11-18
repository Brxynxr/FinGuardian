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
