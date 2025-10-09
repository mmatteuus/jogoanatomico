from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Any

from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.engine import make_url
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def _build_engine_kwargs(url: str) -> dict[str, Any]:
    sa_url = make_url(url)
    kwargs: dict[str, Any] = {"echo": False, "future": True}
    connect_args: dict[str, Any] = {}

    if sa_url.get_backend_name() == "postgresql":
        kwargs["pool_pre_ping"] = True
        hostname = sa_url.host or ""
        sslmode = sa_url.query.get("sslmode")

        if hostname.endswith("neon.tech"):
            kwargs["poolclass"] = NullPool
            connect_args["ssl"] = True

        if isinstance(sslmode, str) and sslmode.lower() == "require":
            connect_args.setdefault("ssl", True)

    elif sa_url.get_backend_name() == "mysql":
        kwargs["pool_pre_ping"] = True
        kwargs.setdefault("pool_recycle", 3600)
        if "charset" not in sa_url.query:
            connect_args.setdefault("charset", "utf8mb4")

    if connect_args:
        kwargs["connect_args"] = connect_args

    return kwargs


engine = create_async_engine(settings.async_database_url, **_build_engine_kwargs(settings.async_database_url))
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def init_models() -> None:
    if settings.project_env not in {"local", "test"}:
        logger.info("database_init_skipped", project_env=settings.project_env)
        return

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("database_initialized")
