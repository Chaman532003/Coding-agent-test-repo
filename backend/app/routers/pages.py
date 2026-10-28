from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

# The built React app. `npm run build` writes it here; without a build the pages are not served.
DIST = Path(__file__).resolve().parents[3] / "frontend" / "dist"

router = APIRouter(include_in_schema=False)


def _index() -> FileResponse:
    return FileResponse(DIST / "index.html")


@router.get("/")
def landing_page():
    return _index()


@router.get("/login")
def login_page():
    return _index()


@router.get("/products")
def products_page():
    return _index()


@router.get("/cart")
def cart_page():
    return _index()
