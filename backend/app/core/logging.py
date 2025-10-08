from __future__ import annotations

import logging
import sys
from typing import Any, Dict

import structlog


def setup_logging(level: str = "INFO") -> None:
    """Configure structlog and standard logging handlers."""

    timestamper = structlog.processors.TimeStamper(fmt="iso", utc=True)

    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            timestamper,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(message)s"))

    logging.basicConfig(handlers=[handler], level=getattr(logging, level.upper(), logging.INFO))


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    return structlog.get_logger(name)


def log_health_event(event: str, **kwargs: Any) -> None:
    logger = get_logger("health")
    logger.info(event, **kwargs)


class AuditLogger:
    def __init__(self, logger_name: str = "audit") -> None:
        self._logger = get_logger(logger_name)

    def log(self, action: str, actor_id: str | None, metadata: Dict[str, Any] | None = None) -> None:
        self._logger.info("audit_event", action=action, actor_id=actor_id, **(metadata or {}))


audit_logger = AuditLogger()
