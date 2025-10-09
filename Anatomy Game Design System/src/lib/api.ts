import {
  Campaign,
  DashboardSummary,
  LeaderboardResponse,
  LoginPayload,
  PreferenceUpdatePayload,
  ProfileSummary,
  QuizAttemptResponse,
  QuizSession,
  QuizSessionPayload,
  RegisterPayload,
  TokenResponse,
  User,
} from './api-types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const API_ROOT = `${API_BASE_URL}/v1`;

async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && options.method && options.method !== 'GET') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const payload = await response.json();
      message = payload.detail || payload.message || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message || 'Erro inesperado ao comunicar com a API');
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  return request<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(credentials: LoginPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function fetchCurrentUser(accessToken: string): Promise<User> {
  return request<User>('/users/me', {}, accessToken);
}

export async function fetchDashboardSummary(accessToken: string): Promise<DashboardSummary> {
  return request<DashboardSummary>('/dashboard/summary', {}, accessToken);
}

export async function fetchCampaigns(accessToken: string): Promise<Campaign[]> {
  return request<Campaign[]>('/campaigns', {}, accessToken);
}

export async function fetchLeaderboard(accessToken: string, scope: string = 'global'): Promise<LeaderboardResponse> {
  const query = new URLSearchParams({ scope });
  return request<LeaderboardResponse>(`/leaderboard?${query.toString()}`, {}, accessToken);
}

export async function fetchProfileSummary(accessToken: string): Promise<ProfileSummary> {
  return request<ProfileSummary>('/users/me/summary', {}, accessToken);
}

export async function updatePreferences(accessToken: string, payload: PreferenceUpdatePayload): Promise<User> {
  return request<User>('/users/me/preferences', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, accessToken);
}

export async function startQuizSession(
  accessToken: string,
  payload: QuizSessionPayload,
): Promise<QuizSession> {
  return request<QuizSession>('/quizzes/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, accessToken);
}

export async function submitQuizAttempt(
  accessToken: string,
  sessionId: string,
  payload: { question_id: string; option_id: string },
): Promise<QuizAttemptResponse> {
  return request<QuizAttemptResponse>(
    `/quizzes/sessions/${sessionId}/attempts`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  );
}

export async function completeQuizSession(
  accessToken: string,
  sessionId: string,
  durationSeconds: number,
): Promise<QuizSession> {
  const query = new URLSearchParams({ duration_seconds: String(durationSeconds) });
  return request<QuizSession>(
    `/quizzes/sessions/${sessionId}/complete?${query.toString()}`,
    { method: 'POST' },
    accessToken,
  );
}
