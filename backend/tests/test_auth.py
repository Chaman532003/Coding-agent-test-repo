def test_login_with_valid_credentials(client):
    response = client.post(
        "/api/login",
        json={"email": "demo@shop.test", "password": "demo1234"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["access_token"]
    assert body["token_type"] == "bearer"


def test_login_with_wrong_password(client):
    response = client.post(
        "/api/login",
        json={"email": "demo@shop.test", "password": "wrongpass1"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password"}


def test_get_profile_with_valid_token(client, valid_token):
    response = client.get(
        "/api/me",
        headers={"Authorization": f"Bearer {valid_token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "demo@shop.test"
    assert isinstance(body["name"], str)


def test_get_profile_without_token(client):
    response = client.get("/api/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_get_profile_with_invalid_token(client):
    response = client.get(
        "/api/me",
        headers={"Authorization": "Bearer invalid_token"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}
