def test_get_cart_without_token(client, reset_store):
    response = client.get("/api/cart")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_add_to_cart_twice(client, valid_token, reset_store):
    headers = {"Authorization": f"Bearer {valid_token}"}

    response1 = client.post(
        "/api/cart/items",
        json={"product_id": 1, "quantity": 1},
        headers=headers,
    )
    assert response1.status_code == 200
    cart1 = response1.json()
    assert len(cart1["items"]) == 1
    assert cart1["items"][0]["product_id"] == 1
    assert cart1["items"][0]["quantity"] == 1
    assert cart1["count"] == 1

    response2 = client.post(
        "/api/cart/items",
        json={"product_id": 1, "quantity": 1},
        headers=headers,
    )
    assert response2.status_code == 200
    cart2 = response2.json()
    assert len(cart2["items"]) == 1
    assert cart2["items"][0]["product_id"] == 1
    assert cart2["items"][0]["quantity"] == 2
    assert cart2["items"][0]["line_total"] == cart2["items"][0]["price"] * 2
    assert cart2["count"] == 2
    assert cart2["total"] == cart2["items"][0]["line_total"]


def test_add_nonexistent_product(client, valid_token, reset_store):
    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.post(
        "/api/cart/items",
        json={"product_id": 999, "quantity": 1},
        headers=headers,
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}


def test_remove_item_from_cart(client, valid_token, reset_store):
    headers = {"Authorization": f"Bearer {valid_token}"}

    client.post(
        "/api/cart/items",
        json={"product_id": 1, "quantity": 1},
        headers=headers,
    )

    response = client.delete(
        "/api/cart/items/1",
        headers=headers,
    )
    assert response.status_code == 200
    cart = response.json()
    assert len(cart["items"]) == 0
    for item in cart["items"]:
        assert item["product_id"] != 1


def test_remove_nonexistent_item(client, valid_token, reset_store):
    headers = {"Authorization": f"Bearer {valid_token}"}
    response = client.delete(
        "/api/cart/items/1",
        headers=headers,
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not in cart"}
