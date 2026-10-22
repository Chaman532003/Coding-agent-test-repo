"""FastAPI application for the backend API."""
from fastapi import FastAPI
from .routers import auth as auth_router
from .routers import products as products_router
from .routers import cart as cart_router
from . import store as store_mod


app = FastAPI()

app.include_router(auth_router.router, prefix='/api')
app.include_router(products_router.router, prefix='/api')
app.include_router(cart_router.router, prefix='/api')


@app.on_event('startup')
def startup() -> None:
    """Application startup hook.

    Ensure the in-memory store is seeded when the application starts.
    """
    store_mod.store.reset()
