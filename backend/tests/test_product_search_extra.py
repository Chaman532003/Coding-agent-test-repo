from backend.app import store


def test_search_q_mixed_case(client):
    # Mixed case query should match regardless of case
    resp = client.get("/api/products?q=PhOnE")
    assert resp.status_code == 200
    data = resp.json()
    returned_ids = {p["id"] for p in data}
    # should match same as lowercase 'phone' test
    assert returned_ids == {2, 3, 8}


def test_search_q_matches_description_only(client):
    # 'desk' appears in description of some items but not necessarily name
    resp = client.get("/api/products?q=desk")
    assert resp.status_code == 200
    data = resp.json()
    # ensure results contain only items where name or description contains 'desk'
    for p in data:
        name_desc = (p.get("name", "") + " " + p.get("description", "")).lower()
        assert "desk" in name_desc


def test_search_q_with_surrounding_spaces(client):
    # Query with leading/trailing spaces should be trimmed and match normally
    resp = client.get("/api/products?q= phone ")
    assert resp.status_code == 200
    data = resp.json()
    returned_ids = {p["id"] for p in data}
    assert returned_ids == {2, 3, 8}

