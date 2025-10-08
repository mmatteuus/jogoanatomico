from __future__ import annotations

from typing import List

from pydantic import BaseModel

from app.domain.models.leaderboard import LeaderboardScope


class LeaderboardEntry(BaseModel):
    user_id: str
    display_name: str
    xp: int
    streak: int
    rank: int
    avatar: str | None = None


class LeaderboardResponse(BaseModel):
    scope: LeaderboardScope
    entries: List[LeaderboardEntry]
    generated_at: str
