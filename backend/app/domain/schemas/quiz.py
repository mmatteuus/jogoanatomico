from __future__ import annotations

import uuid
from typing import List, Optional

from pydantic import BaseModel, Field

from app.domain.models import DifficultyLevel, QuestionType
from app.domain.models.progress import QuizMode


class QuizSessionCreate(BaseModel):
    mode: QuizMode
    system: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = Field(default=None)
    limit: int = Field(default=10, le=50)


class QuizOptionChoice(BaseModel):
    id: uuid.UUID
    label: str


class QuizQuestionWithOptions(BaseModel):
    id: uuid.UUID
    prompt: str
    anatomy_system: str
    type: QuestionType
    difficulty: DifficultyLevel
    options: List[QuizOptionChoice]


class QuizSessionRead(BaseModel):
    id: uuid.UUID
    mode: QuizMode
    score: float
    duration_seconds: int
    completed: bool
    questions: List[QuizQuestionWithOptions]


class QuizAttemptCreate(BaseModel):
    question_id: uuid.UUID
    option_id: uuid.UUID


class QuizAttemptRead(BaseModel):
    id: uuid.UUID
    question_id: uuid.UUID
    selected_option_id: Optional[uuid.UUID]
    is_correct: bool
