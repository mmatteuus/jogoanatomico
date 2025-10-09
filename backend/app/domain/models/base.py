
import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class BaseSQLModel(SQLModel):
    __allow_unmapped__ = True

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    def touch(self) -> None:
        self.updated_at = datetime.utcnow()
