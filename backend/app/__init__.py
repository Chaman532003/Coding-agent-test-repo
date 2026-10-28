from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import auth, products, cart, pages


def create_app():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(products.router)
    app.include_router(cart.router)

    # Serve the built React app from the same process, so one port shows the UI and the API.
    if (pages.DIST / "index.html").is_file():
        app.mount("/assets", StaticFiles(directory=pages.DIST / "assets"), name="assets")
        app.include_router(pages.router)

    return app
