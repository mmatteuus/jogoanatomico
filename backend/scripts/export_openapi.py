from __future__ import annotations

import json
from pathlib import Path

from app.main import create_app

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "openapi.yaml"


def main() -> None:
    app = create_app()
    with app.openapi_context():
        spec = app.openapi()
    OUTPUT_PATH.write_text(json.dumps(spec, indent=2), encoding="utf-8")
    print(f"OpenAPI spec exported to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
