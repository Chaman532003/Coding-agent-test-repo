import pytest
from fastapi.testclient import TestClient

from backend.app import create_app
from backend.app.routers import pages

PAGES = ["/", "/login", "/products", "/cart"]


@pytest.fixture
def built_app(tmp_path, monkeypatch):
    (tmp_path / "assets").mkdir()
    (tmp_path / "index.html").write_text("<!doctype html><div id='root'></div>")
    (tmp_path / "assets" / "app.js").write_text("console.log('app')")
    monkeypatch.setattr(pages, "DIST", tmp_path)
    return TestClient(create_app())


@pytest.mark.parametrize("path", PAGES)
def test_every_page_serves_the_built_app(built_app, path):
    response = built_app.get(path)
    assert response.status_code == 200
    assert "id='root'" in response.text


def test_built_assets_are_served(built_app):
    response = built_app.get("/assets/app.js")
    assert response.status_code == 200
    assert "console.log" in response.text


def test_the_api_is_still_served_next_to_the_pages(built_app):
    response = built_app.get("/api/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_without_a_build_only_the_api_is_served(tmp_path, monkeypatch):
    monkeypatch.setattr(pages, "DIST", tmp_path / "missing")
    client = TestClient(create_app())
    assert client.get("/").status_code == 404
    assert client.get("/api/products").status_code == 200
