import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.database import Base, get_db
from backend.app.services.seeder import seed_demo_data
from backend.app.main import app

@pytest.fixture
def client():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    seed_session = TestingSessionLocal()
    seed_demo_data(seed_session)
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

def test_api_summary_and_employees(client):
    res = client.get("/api/financial/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "InnovaCloud Tech SAS"
    assert data["current_balance"] == 5000.0
    assert data["health_score"] > 0

    emp_res = client.get("/api/employees")
    assert emp_res.status_code == 200
    emps = emp_res.json()["employees"]
    assert len(emps) == 5

def test_api_cfo_chat(client):
    res = client.post("/api/chat/cfo", json={"message": "¿Cuál es nuestro saldo?"})
    assert res.status_code == 200
    assert "response" in res.json()
    assert len(res.json()["response"]) > 10

def test_api_analyze_and_approve(client):
    prop_res = client.post("/api/agent/analyze-and-propose")
    assert prop_res.status_code == 200
    prop_data = prop_res.json()
    assert prop_data["success"] is True
    p_id = prop_data["proposal"]["id"]

    app_res = client.post(f"/api/agent/approve/{p_id}", json={"approved_by": "ADMIN_WEB"})
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "APPROVED"
