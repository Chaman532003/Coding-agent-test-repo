from backend.app import store


def test_search_q_matches_name_and_description(client):
    # 'phone' should match 'Wireless Headphones', 'Smartphone', and 'Phone Case'
    resp = client.get("/api/products?q=phone")
    assert resp.status_code == 200
    data = resp.json()
    returned_ids = {p["id"] for p in data}
    assert returned_ids == {2, 3, 8}

    # query that matches nothing returns empty list
    resp = client.get("/api/products?q=nonexistentterm")
    assert resp.status_code == 200
    assert resp.json() == []


def test_sorting_and_unknown_sort_returns_422(client):
    # price ascending
    resp = client.get("/api/products?sort=price_asc")
    assert resp.status_code == 200
    prices = [p["price"] for p in resp.json()]
    assert prices == sorted(prices)

    # price descending
    resp = client.get("/api/products?sort=price_desc")
    assert resp.status_code == 200
    prices = [p["price"] for p in resp.json()]
    assert prices == sorted(prices, reverse=True)

    # name ascending
    resp = client.get("/api/products?sort=name")
    assert resp.status_code == 200
    names = [p["name"] for p in resp.json()]
    assert names == sorted(names)

    # unknown sort -> 422
    resp = client.get("/api/products?sort=unknown_sort")
    assert resp.status_code == 422


def test_no_params_preserves_original_list_and_order(client):
    resp = client.get("/api/products")
    assert resp.status_code == 200
    data = resp.json()
    # original ordering should match store.products_db
    expected = store.products_db
    assert data == expected

