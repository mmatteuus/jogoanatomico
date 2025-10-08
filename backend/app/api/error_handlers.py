from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc: HTTPException):  # type: ignore[override]
        logger.warning(
            "http_exception",
            status_code=exc.status_code,
            detail=exc.detail,
            path=str(request.url),
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail, "status_code": exc.status_code},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request, exc: Exception):  # type: ignore[override]
        logger.exception("unhandled_exception", path=str(request.url))
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
