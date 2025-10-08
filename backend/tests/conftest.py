from __future__ import annotations

import asyncio
import os
from collections.abc import AsyncGenerator, Generator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
os.environ.setdefault("REFRESH_TOKEN_EXPIRE_MINUTES", "1440")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("PROJECT_ENV", "test")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
os.environ.setdefault("SYNC_DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
os.environ.setdefault("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
os.environ.setdefault("FEATURE_FLAG_OSCE", "true")
os.environ.setdefault("FEATURE_FLAG_SRS", "true")
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "1000")
os.environ.setdefault("DEFAULT_PAGE_SIZE", "20")
os.environ.setdefault("MAX_PAGE_SIZE", "100")
os.environ.setdefault("LOG_LEVEL", "INFO")

from app.api.common.rate_limit import rate_limiter
from app.api.dependencies import get_db_session
from app.core import config
from app.main import create_app

config.get_settings.cache_clear()
settings = config.get_settings()
engine = create_async_engine(settings.database_url, future=True)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def prepare_database() -> AsyncGenerator[None, None]:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


async def override_get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


@pytest.fixture()
async def client(prepare_database) -> AsyncGenerator[AsyncClient, None]:  # type: ignore[override]
    app = create_app()
    app.dependency_overrides[get_db_session] = override_get_session
    app.dependency_overrides[rate_limiter] = lambda: None

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as async_client:
        yield async_client

    app.dependency_overrides.clear()
