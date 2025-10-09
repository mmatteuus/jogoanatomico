export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string | null;
  display_name: string;
  profile_type: 'student' | 'professional' | 'professor' | 'guest';
  role: 'student' | 'professional' | 'teacher' | 'admin';
  xp: number;
  streak: number;
  energy: number;
  elo_rating: number;
  preferences: Record<string, unknown>;
}

export interface DailyMissionSummary {
  mission_id: string;
  title: string;
  progress: number;
  target: number;
  xp_reward: number;
  expires_at: string | null;
}

export interface SystemProgressSummary {
  system: string;
  completion_rate: number;
}

export interface DashboardSummary {
  xp: number;
  streak: number;
  energy: number;
  elo_rating: number;
  missions: DailyMissionSummary[];
  systems: SystemProgressSummary[];
  active_campaign: Record<string, unknown> | null;
}

export interface CampaignLesson {
  id: string;
  order: number;
  title: string;
  content_url: string;
  duration_minutes: number;
  xp_reward: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  anatomy_system: string;
  recommended_level: number;
  lessons: CampaignLesson[];
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  xp: number;
  streak: number;
  rank: number;
  avatar?: string | null;
}

export interface LeaderboardResponse {
  scope: string;
  entries: LeaderboardEntry[];
  generated_at: string;
}

export interface ProfileSummary {
  user: User;
  systems_progress: Record<string, number>;
  daily_missions_completed: number;
  weekly_missions_completed: number;
}

export interface QuizOptionChoice {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  anatomy_system: string;
  type: string;
  difficulty: string;
  options: QuizOptionChoice[];
}

export interface QuizSession {
  id: string;
  mode: string;
  score: number;
  duration_seconds: number;
  completed: boolean;
  questions: QuizQuestion[];
}

export interface QuizAttemptResponse {
  id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
  profile_type: User['profile_type'];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface QuizSessionPayload {
  mode: 'sprint' | 'campaign' | 'osce' | 'srs';
  system?: string | null;
  difficulty?: string | null;
  limit?: number;
}

export interface PreferenceUpdatePayload {
  dark_mode?: boolean;
  language?: string;
  notifications?: boolean;
}
