import enum
import uuid

from sqlalchemy.orm import Mapped
from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class QuestionType(str, enum.Enum):
    identification = "identification"
    multiple_choice = "multiple_choice"
    true_false = "true_false"


class DifficultyLevel(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class QuizQuestion(BaseSQLModel, table=True):
    __tablename__ = "quiz_questions"

    prompt: str = Field(nullable=False)
    anatomy_system: str = Field(nullable=False, index=True)
    type: QuestionType = Field(default=QuestionType.multiple_choice)
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.medium)
    media_url: str | None = Field(default=None)

    options: Mapped[list["QuizOption"]] = Relationship(back_populates="question")


class QuizOption(BaseSQLModel, table=True):
    __tablename__ = "quiz_options"

    question_id: uuid.UUID = Field(foreign_key="quiz_questions.id", nullable=False)
    label: str = Field(nullable=False)
    is_correct: bool = Field(default=False)

    question: Mapped["QuizQuestion"] = Relationship(back_populates="options")
