from __future__ import annotations

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.logging import get_logger

scheduler = AsyncIOScheduler()
logger = get_logger(__name__)


def start_scheduler() -> None:
    if not scheduler.running:
        scheduler.start()
        logger.info("scheduler_started")


def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("scheduler_stopped")
