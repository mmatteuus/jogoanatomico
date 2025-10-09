from __future__ import annotations

import argparse
import sys
from pathlib import Path

from alembic import command
from alembic.config import Config

from app.core.config import settings


def build_config(database_url: str | None) -> Config:
    project_root = Path(__file__).resolve().parent.parent
    alembic_cfg = Config(str(project_root / "alembic.ini"))
    target_url = database_url or settings.sync_database_url_with_driver
    alembic_cfg.set_main_option("sqlalchemy.url", target_url)
    return alembic_cfg


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Install or upgrade the Jogo de Anatomia schema.")
    parser.add_argument(
        "--database-url",
        dest="database_url",
        help="SQLAlchemy connection string (overrides SYNC_DATABASE_URL)",
    )
    parser.add_argument(
        "--revision",
        dest="revision",
        default="head",
        help="Alembic revision to apply (default: head)",
    )
    args = parser.parse_args(argv)

    alembic_cfg = build_config(args.database_url)
    command.upgrade(alembic_cfg, args.revision)


if __name__ == "__main__":
    main(sys.argv[1:])
