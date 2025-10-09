"""initial schema"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("email", sa.String(), nullable=True, unique=True),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("display_name", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("profile_type", sa.String(), nullable=False),
        sa.Column("xp", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("streak", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("energy", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("elo_rating", sa.Integer(), nullable=False, server_default="1200"),
        sa.Column("preferences", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("organization_id", sa.Uuid(), nullable=True),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"])

    op.create_table(
        "organizations",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column("kind", sa.String(), nullable=False),
    )

    op.create_table(
        "classrooms",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("invite_code", sa.String(), nullable=False, unique=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "classroom_memberships",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("classroom_id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["classroom_id"], ["classrooms.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "missions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("xp_reward", sa.Integer(), nullable=False),
        sa.Column("target", sa.Integer(), nullable=False),
        sa.Column("frequency", sa.String(), nullable=False),
        sa.Column("category", sa.String(), nullable=False),
    )

    op.create_table(
        "mission_progress",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("mission_id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("progress", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["mission_id"], ["missions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "campaigns",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("title", sa.String(), nullable=False, unique=True),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("anatomy_system", sa.String(), nullable=False),
        sa.Column("recommended_level", sa.Integer(), nullable=False),
    )

    op.create_table(
        "campaign_lessons",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("campaign_id", sa.Uuid(), nullable=False),
        sa.Column("lesson_order", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("content_url", sa.String(), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("xp_reward", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["campaign_id"], ["campaigns.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "campaign_progress",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("score", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lesson_id"], ["campaign_lessons.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "quiz_questions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("prompt", sa.String(), nullable=False),
        sa.Column("anatomy_system", sa.String(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("difficulty", sa.String(), nullable=False),
        sa.Column("media_url", sa.String(), nullable=True),
    )

    op.create_table(
        "quiz_options",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("question_id", sa.Uuid(), nullable=False),
        sa.Column("label", sa.String(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["question_id"], ["quiz_questions.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "quiz_sessions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("mode", sa.String(), nullable=False),
        sa.Column("system", sa.String(), nullable=True),
        sa.Column("score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("duration_seconds", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "quiz_attempts",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("session_id", sa.Uuid(), nullable=False),
        sa.Column("question_id", sa.Uuid(), nullable=False),
        sa.Column("selected_option_id", sa.Uuid(), nullable=True),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["session_id"], ["quiz_sessions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["question_id"], ["quiz_questions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["selected_option_id"], ["quiz_options.id"], ondelete="SET NULL"),
    )

    op.create_table(
        "user_system_progress",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("system", sa.String(), nullable=False),
        sa.Column("completion_rate", sa.Float(), nullable=False, server_default="0"),
        sa.Column("last_interaction", sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "anatomy_structures",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("latin_name", sa.String(), nullable=True),
        sa.Column("system", sa.String(), nullable=False),
        sa.Column("region", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("asset_uri", sa.String(), nullable=True),
    )

    op.create_table(
        "anatomy_layers",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("structure_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("visible", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.ForeignKeyConstraint(["structure_id"], ["anatomy_structures.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "leaderboard_snapshots",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("scope", sa.String(), nullable=False),
        sa.Column("reference_id", sa.Uuid(), nullable=True),
        sa.Column("generated_at", sa.DateTime(), nullable=False),
        sa.Column("data", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
    )

    op.create_table(
        "webhook_subscriptions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("target_url", sa.String(), nullable=False),
        sa.Column("secret", sa.String(), nullable=False),
        sa.Column("event", sa.String(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
    )


def downgrade() -> None:
    op.drop_table("webhook_subscriptions")
    op.drop_table("leaderboard_snapshots")
    op.drop_table("anatomy_layers")
    op.drop_table("anatomy_structures")
    op.drop_table("user_system_progress")
    op.drop_table("quiz_attempts")
    op.drop_table("quiz_sessions")
    op.drop_table("quiz_options")
    op.drop_table("quiz_questions")
    op.drop_table("campaign_progress")
    op.drop_table("campaign_lessons")
    op.drop_table("campaigns")
    op.drop_table("mission_progress")
    op.drop_table("missions")
    op.drop_table("classroom_memberships")
    op.drop_table("classrooms")
    op.drop_table("organizations")
    op.drop_table("users")
