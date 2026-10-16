from fastapi.testclient import TestClient
from backend.app.main import app


def test_AC_2_1_products_list():
    """AC-2.1: GET /api/products returns 8 products with required fields and types."""
    client = TestClient(app)
    res = client.get("/api/products")
    assert res.status_code == 200, res.text
    data = res.json()
    assert isinstance(data, list), "products response must be a list"
    assert len(data) == 8, f"expected 8 products, got {len(data)}"
    for item in data:
        assert isinstance(item.get("id"), int)
        assert isinstance(item.get("name"), str)
        # price may be int or float; ensure numeric
        assert isinstance(item.get("price"), (float, int))
        assert isinstance(item.get("image_url"), str)
        assert isinstance(item.get("description"), str)
