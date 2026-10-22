from fastapi.testclient import TestClient
from backend.app.main import app


def _login_get_token(client: TestClient):
    res = client.post("/api/login", json={"email": "demo@shop.test", "password": "demo1234"})
    assert res.status_code == 200, res.text
    data = res.json()
    token = data.get("access_token")
    assert token, "login did not return access_token"
    return token


def test_AC_3_1_cart_unauthenticated():
    """AC-3.1: GET /api/cart without auth returns 401 Not authenticated."""
    client = TestClient(app)
    res = client.get("/api/cart")
    assert res.status_code == 401, res.text
    assert res.json() == {"detail": "Not authenticated"}


def test_AC_4_1_add_item_twice():
    """AC-4.1: Adding same product twice increments quantity and totals reflect line_total*2."""
    client = TestClient(app)
    token = _login_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # fetch product to know price
    p_res = client.get("/api/products")
    assert p_res.status_code == 200
    products = p_res.json()
    product = next((p for p in products if p["id"] == 1), products[0])
    price = float(product["price"])

    # first add
    res1 = client.post("/api/cart/items", json={"product_id": 1, "quantity": 1}, headers=headers)
    assert res1.status_code in (200, 201, 202), res1.text

    # second add
    res2 = client.post("/api/cart/items", json={"product_id": 1, "quantity": 1}, headers=headers)
    assert res2.status_code == 200, res2.text
    cart = res2.json()
    assert isinstance(cart.get("items"), list)

    # find item for product 1
    items = cart.get("items", [])
    item = next((it for it in items if it.get("product_id") == 1), None)
    assert item is not None, "expected an item for product_id 1"
    assert item.get("quantity") == 2, f"expected quantity 2, got {item.get('quantity')!r}"
    assert float(item.get("line_total")) == price * 2

    assert cart.get("count") == 2
    # total equals sum of line_totals
    total = float(cart.get("total") or 0)
    computed = sum(float(it.get("line_total") or 0) for it in items)
    assert abs(total - computed) < 0.0001


def test_AC_5_1_add_nonexistent_product():
    """AC-5.1: Adding a non-existent product returns 404 Product not found."""
    client = TestClient(app)
    token = _login_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post("/api/cart/items", json={"product_id": 9999, "quantity": 1}, headers=headers)
    assert res.status_code == 404, res.text
    assert res.json() == {"detail": "Product not found"}


def test_AC_6_1_delete_existing_item():
    """AC-6.1: Deleting an existing item removes it from the cart."""
    client = TestClient(app)
    token = _login_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # add product 1
    add_res = client.post("/api/cart/items", json={"product_id": 1, "quantity": 1}, headers=headers)
    assert add_res.status_code == 200

    del_res = client.delete("/api/cart/items/1", headers=headers)
    assert del_res.status_code == 200, del_res.text
    cart = del_res.json()
    items = cart.get("items", [])
    assert not any(it.get("product_id") == 1 for it in items), "product 1 should have been removed"


def test_AC_6_2_delete_nonexistent_item():
    """AC-6.2: Deleting an item not in cart returns 404 Item not in cart."""
    client = TestClient(app)
    token = _login_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    res = client.delete("/api/cart/items/99", headers=headers)
    assert res.status_code == 404, res.text
    assert res.json() == {"detail": "Item not in cart"}
