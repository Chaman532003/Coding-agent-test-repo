from backend.app import store


def test_min_max_price_inclusive_filter(client):
    # min_price only: should include products priced >= 24.99 (includes id 8, excludes id 6)
    resp = client.get("/api/products?min_price=24.99")
    assert resp.status_code == 200
    ids = {p["id"] for p in resp.json()}
    assert 8 in ids
    assert 6 not in ids

    # max_price only: should include products priced <= 34.99 (includes id 7 and 8, excludes id 3)
    resp = client.get("/api/products?max_price=34.99")
    assert resp.status_code == 200
    ids = {p["id"] for p in resp.json()}
    assert 7 in ids
    assert 8 in ids
    assert 3 not in ids

    # both min and max: inclusive range 24.99..34.99 should include ids 7 and 8 only
    resp = client.get("/api/products?min_price=24.99&max_price=34.99")
    assert resp.status_code == 200
    ids = {p["id"] for p in resp.json()}
    assert ids == {7, 8}


def test_invalid_price_inputs_and_min_greater_than_max_return_422(client):
    # non-numeric value -> 422
    resp = client.get("/api/products?min_price=notanumber")
    assert resp.status_code == 422

    # min > max -> 422
    resp = client.get("/api/products?min_price=1000&max_price=10")
    assert resp.status_code == 422


def test_combination_with_q_and_sort_applies_search_then_range_then_sort(client):
    # q=phone matches ids {2,3,8}. Apply min_price=100 to drop id 8, then sort price_desc -> [3,2]
    resp = client.get("/api/products?q=phone&min_price=100&sort=price_desc")
    assert resp.status_code == 200
    data = resp.json()
    ids_ordered = [p["id"] for p in data]
    assert ids_ordered == [3, 2]


def test_no_price_params_preserves_original_behavior(client):
    resp = client.get("/api/products")
    assert resp.status_code == 200
    assert resp.json() == store.products_db

