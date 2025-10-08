from __future__ import annotations

from pathlib import Path
from typing import BinaryIO

from fastapi import UploadFile

STORAGE_PATH = Path("storage")
STORAGE_PATH.mkdir(exist_ok=True)


async def save_file(file: UploadFile, folder: str = "uploads") -> str:
    target_dir = STORAGE_PATH / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / file.filename
    content = await file.read()
    target_path.write_bytes(content)
    return str(target_path)
