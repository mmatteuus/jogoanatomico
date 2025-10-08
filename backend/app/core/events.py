from __future__ import annotations

from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import get_logger, log_health_event, setup_logging
from app.infrastructure.db.session import init_models
from app.infrastructure.jobs.scheduler import scheduler, shutdown_scheduler, start_scheduler
from app.infrastructure.observability.tracing import configure_tracing

logger = get_logger(__name__)


async def on_startup(app: FastAPI) -> None:
    setup_logging(settings.log_level)
    configure_tracing()
    await init_models()
    start_scheduler()
    scheduler.add_job(log_health_event, "interval", seconds=60, args=["health_ping"], id="health_ping", replace_existing=True)
    log_health_event("service_startup", environment=settings.project_env)


async def on_shutdown(app: FastAPI) -> None:
    shutdown_scheduler()
    log_health_event("service_shutdown")
