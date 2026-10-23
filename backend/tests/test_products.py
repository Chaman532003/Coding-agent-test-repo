def test_get_products(client):
    response = client.get("/api/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 8
    for product in products:
        assert "id" in product
        assert isinstance(product["id"], int)
        assert "name" in product
        assert isinstance(product["name"], str)
        assert "price" in product
        assert isinstance(product["price"], (int, float))
        assert "image_url" in product
        assert isinstance(product["image_url"], str)
        assert "description" in product
        assert isinstance(product["description"], str)
