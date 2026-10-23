import pytest
from fastapi.testclient import TestClient
from backend.app import create_app
from backend.app.auth import get_password_hash, create_access_token
from backend.app import store


@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)


@pytest.fixture
def reset_store():
    store.carts = {}
    yield
    store.carts = {}


@pytest.fixture
def valid_token():
    return create_access_token(data={"sub": "demo@shop.test"})
