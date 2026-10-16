from fastapi.testclient import TestClient
from backend.app.main import app


def test_AC_1_1_login_success():
    """AC-1.1: Correct credentials return token and token_type 'bearer'."""
    client = TestClient(app)
    res = client.post("/api/login", json={"email": "demo@shop.test", "password": "demo1234"})
    assert res.status_code == 200, res.text
    data = res.json()
    assert isinstance(data, dict)
    assert "access_token" in data and isinstance(data["access_token"], str) and data["access_token"], "access_token must be non-empty string"
    assert data.get("token_type") == "bearer"


def test_AC_1_2_login_failure():
    """AC-1.2: Wrong password returns 401 with specific detail."""
    client = TestClient(app)
    res = client.post("/api/login", json={"email": "demo@shop.test", "password": "wrongpass1"})
    assert res.status_code == 401, res.text
    assert res.json() == {"detail": "Invalid email or password"}
