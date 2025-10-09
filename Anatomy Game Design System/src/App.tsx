import { useEffect, useMemo, useState } from 'react';

import { AuthScreen } from './components/screens/AuthScreen';
import { CampaignScreen } from './components/screens/CampaignScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TeacherDashboard } from './components/screens/TeacherDashboard';
import { Viewer3DScreen } from './components/screens/Viewer3DScreen';
import { Toaster } from './components/ui/sonner';
import { apiHelpers } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Campaign, DashboardSummary, LeaderboardResponse, ProfileSummary, QuizSession } from './lib/api-types';

export type Screen =
  | 'home'
  | 'sprint'
  | 'campaign'
  | 'osce'
  | 'srs'
  | '3d-explorer'
  | 'leaderboard'
  | 'profile'
  | 'settings'
  | 'teacher';

const DARK_MODE_KEY = 'jogo-anatomia.dark-mode';

export default function App() {
  const { user, accessToken, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem(DARK_MODE_KEY) === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.profile_type === 'professor') {
      setCurrentScreen('teacher');
    } else {
      setCurrentScreen('home');
    }
  }, [user]);

  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    if (!accessToken) {
      setDashboard(null);
      setProfileSummary(null);
      setLeaderboard(null);
      setCampaigns([]);
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        const [dashboardResponse, profileResponse, leaderboardResponse, campaignsResponse] = await Promise.all([
          apiHelpers.fetchDashboardSummary(accessToken),
          apiHelpers.fetchProfileSummary(accessToken),
          apiHelpers.fetchLeaderboard(accessToken),
          apiHelpers.fetchCampaigns(accessToken),
        ]);
        if (!cancelled) {
          setDashboard(dashboardResponse);
          setProfileSummary(profileResponse);
          setLeaderboard(leaderboardResponse);
          setCampaigns(campaignsResponse);
        }
      } catch (error) {
        console.error('Falha ao carregar dados iniciais', error);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const quizSessionCache = useMemo(() => ({ current: null as QuizSession | null }), []);

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen);

  const handleToggleDarkMode = async () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));

    if (accessToken) {
      try {
        await apiHelpers.updatePreferences(accessToken, { dark_mode: next });
      } catch (error) {
        console.error('Nao foi possivel salvar a preferencia de tema', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando
      </div>
    );
  }

  if (!user || !accessToken) {
    return (
      <>
        <AuthScreen />
        <Toaster />
      </>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen user={user} dashboard={dashboard} onNavigate={handleNavigate} />;
      case 'sprint':
        return (
          <QuizScreen
            mode="sprint"
            token={accessToken}
            sessionCache={quizSessionCache}
            onExit={() => handleNavigate('home')}
          />
        );
      case 'campaign':
        return (
          <CampaignScreen
            token={accessToken}
            campaigns={campaigns}
            onBack={() => handleNavigate('home')}
            onStartLesson={() => handleNavigate('sprint')}
          />
        );
      case 'osce':
        return (
          <QuizScreen
            mode="osce"
            token={accessToken}
            sessionCache={quizSessionCache}
            onExit={() => handleNavigate('home')}
          />
        );
      case 'srs':
        return (
          <QuizScreen
            mode="srs"
            token={accessToken}
            sessionCache={quizSessionCache}
            onExit={() => handleNavigate('home')}
          />
        );
      case '3d-explorer':
        return <Viewer3DScreen onBack={() => handleNavigate('home')} />;
      case 'leaderboard':
        return (
          <LeaderboardScreen
            data={leaderboard}
            token={accessToken}
            onBack={() => handleNavigate('home')}
            onScopeChange={async (scope) => {
              const response = await apiHelpers.fetchLeaderboard(accessToken, scope);
              setLeaderboard(response);
            }}
          />
        );
      case 'profile':
        return <ProfileScreen summary={profileSummary} onBack={() => handleNavigate('home')} />;
      case 'settings':
        return (
          <SettingsScreen
            user={user}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'teacher':
        return (
          <TeacherDashboard
            campaigns={campaigns}
            leaderboard={leaderboard}
            onBack={() => handleNavigate('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <Toaster />
    </div>
  );
}
