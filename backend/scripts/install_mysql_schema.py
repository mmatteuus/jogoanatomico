"""Instalador de schema para a instância MySQL oficial do Jogo de Anatomia."""
from __future__ import annotations

import argparse
import os
from pathlib import Path

from alembic import command
from alembic.config import Config


def build_alembic_config(database_url: str) -> Config:
    base_dir = Path(__file__).resolve().parent.parent
    alembic_cfg = Config(str(base_dir / "alembic.ini"))
    alembic_cfg.set_main_option("sqlalchemy.url", database_url)
    return alembic_cfg


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Aplica as migrations na instância MySQL configurada.")
    parser.add_argument(
        "--database-url",
        dest="database_url",
        default=os.getenv("DATABASE_URL"),
        help="Connection string completa para a instância MySQL (padrão: variável de ambiente DATABASE_URL)",
    )
    parser.add_argument(
        "--revision",
        dest="revision",
        default="head",
        help="Revisão Alembic a ser aplicada (padrão: head)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.database_url:
        raise SystemExit("Defina --database-url ou a variável de ambiente DATABASE_URL com a conexão MySQL.")

    cfg = build_alembic_config(args.database_url)
    command.upgrade(cfg, args.revision)

if __name__ == "__main__":
    main()
