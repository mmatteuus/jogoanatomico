from __future__ import annotations

import uuid

from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import (
    DifficultyLevel,
    QuestionType,
    QuizAttempt,
    QuizMode,
    QuizOption,
    QuizQuestion,
    QuizSession,
    User,
)


async def create_session(
    session: AsyncSession,
    user: User,
    mode: QuizMode,
    system_filter: str | None = None,
    difficulty: DifficultyLevel | None = None,
    limit: int = 10,
) -> tuple[QuizSession, list[QuizQuestion]]:
    quiz_session = QuizSession(user_id=user.id, mode=mode, system=system_filter)
    session.add(quiz_session)
    await session.flush()

    query = select(QuizQuestion).options(selectinload(QuizQuestion.options))
    if system_filter:
        query = query.where(QuizQuestion.anatomy_system == system_filter)
    if difficulty:
        query = query.where(QuizQuestion.difficulty == difficulty)
    query = query.order_by(func.random()).limit(limit)

    result = await session.exec(query)
    questions = result.all()

    if not questions:
        raise ValueError("No questions available for the selected filters")

    quiz_session.touch()
    session.add(quiz_session)
    await session.commit()
    await session.refresh(quiz_session)
    return quiz_session, questions


async def get_session(session: AsyncSession, session_id: uuid.UUID) -> QuizSession | None:
    result = await session.exec(select(QuizSession).where(QuizSession.id == session_id))
    quiz_session = result.first()
    if quiz_session:
        await session.refresh(quiz_session)
    return quiz_session


async def submit_answer(
    session: AsyncSession,
    quiz_session: QuizSession,
    question_id: uuid.UUID,
    option_id: uuid.UUID,
) -> QuizAttempt:
    result = await session.exec(
        select(QuizOption).where(QuizOption.id == option_id, QuizOption.question_id == question_id)
    )
    option = result.first()
    if not option:
        raise ValueError("Invalid option for question")

    attempt = QuizAttempt(
        session_id=quiz_session.id,
        question_id=question_id,
        selected_option_id=option_id,
        is_correct=option.is_correct,
    )
    session.add(attempt)

    if option.is_correct:
        quiz_session.score += 1
    quiz_session.touch()
    session.add(quiz_session)

    await session.commit()
    await session.refresh(attempt)
    await session.refresh(quiz_session)
    return attempt


async def complete_session(session: AsyncSession, quiz_session: QuizSession, duration_seconds: int) -> QuizSession:
    quiz_session.duration_seconds = duration_seconds
    quiz_session.completed = True
    quiz_session.touch()
    session.add(quiz_session)
    await session.commit()
    await session.refresh(quiz_session)
    return quiz_session
