from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.error_handlers import register_error_handlers
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.events import on_shutdown, on_startup


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, version="1.0.0", openapi_url=f"{settings.api_v1_str}/openapi.json")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_v1_str)
    register_error_handlers(app)

    Instrumentator().instrument(app).expose(app)

    @app.on_event("startup")
    async def _startup() -> None:
        await on_startup(app)

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        await on_shutdown(app)

    return app


app = create_app()
