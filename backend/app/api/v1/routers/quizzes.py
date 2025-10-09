from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session
from app.domain.schemas.quiz import (
    QuizAttemptCreate,
    QuizAttemptRead,
    QuizOptionChoice,
    QuizQuestionWithOptions,
    QuizSessionCreate,
    QuizSessionRead,
)
from app.domain.services import progress as progress_service
from app.domain.services import quiz as quiz_service

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.post("/sessions", response_model=QuizSessionRead, status_code=status.HTTP_201_CREATED)
async def create_quiz_session(
    payload: QuizSessionCreate,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    quiz_session, questions = await quiz_service.create_session(
        session,
        current_user,
        payload.mode,
        system_filter=payload.system,
        difficulty=payload.difficulty,
        limit=payload.limit,
    )
    return QuizSessionRead(
        id=quiz_session.id,
        mode=quiz_session.mode,
        score=quiz_session.score,
        duration_seconds=quiz_session.duration_seconds,
        completed=quiz_session.completed,
        questions=[
            QuizQuestionWithOptions(
                id=question.id,
                prompt=question.prompt,
                anatomy_system=question.anatomy_system,
                type=question.type,
                difficulty=question.difficulty,
                options=[QuizOptionChoice(id=option.id, label=option.label) for option in question.options],
            )
            for question in questions
        ],
    )


@router.post("/sessions/{session_id}/attempts", response_model=QuizAttemptRead)
async def submit_attempt(
    session_id: uuid.UUID,
    payload: QuizAttemptCreate,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    quiz_session = await quiz_service.get_session(session, session_id)
    if not quiz_session or quiz_session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    attempt = await quiz_service.submit_answer(
        session, quiz_session, payload.question_id, payload.option_id
    )
    if attempt.is_correct and quiz_session.system:
        from app.domain.models.progress import AnatomySystem

        await progress_service.update_system_progress(
            session, current_user, AnatomySystem(quiz_session.system), 0.05
        )
    return QuizAttemptRead(
        id=attempt.id,
        question_id=attempt.question_id,
        selected_option_id=attempt.selected_option_id,
        is_correct=attempt.is_correct,
    )


@router.post("/sessions/{session_id}/complete", response_model=QuizSessionRead)
async def complete_session(
    session_id: uuid.UUID,
    duration_seconds: int,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    quiz_session = await quiz_service.get_session(session, session_id)
    if not quiz_session or quiz_session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    quiz_session = await quiz_service.complete_session(session, quiz_session, duration_seconds)
    return QuizSessionRead(
        id=quiz_session.id,
        mode=quiz_session.mode,
        score=quiz_session.score,
        duration_seconds=quiz_session.duration_seconds,
        completed=quiz_session.completed,
        questions=[],
    )
