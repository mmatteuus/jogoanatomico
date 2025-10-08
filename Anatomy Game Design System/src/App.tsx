import { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { CampaignScreen } from './components/screens/CampaignScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { Viewer3DScreen } from './components/screens/Viewer3DScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TeacherDashboard } from './components/screens/TeacherDashboard';
import { Toaster } from './components/ui/sonner';

type Screen = 
  | 'onboarding' 
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(savedProfile);
      setCurrentScreen('home');
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleOnboardingComplete = (profile: string) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', profile);
    // Redirect teachers to teacher dashboard
    if (profile === 'professor') {
      setCurrentScreen('teacher');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      
      case 'sprint':
        return <QuizScreen mode="sprint" onExit={() => handleNavigate('home')} />;
      
      case 'campaign':
        return (
          <CampaignScreen 
            onBack={() => handleNavigate('home')} 
            onStartLesson={() => handleNavigate('sprint')}
          />
        );
      
      case 'osce':
        return <QuizScreen mode="osce" onExit={() => handleNavigate('home')} />;
      
      case 'srs':
        return <QuizScreen mode="srs" onExit={() => handleNavigate('home')} />;
      
      case '3d-explorer':
        return <Viewer3DScreen onBack={() => handleNavigate('home')} />;
      
      case 'leaderboard':
        return <LeaderboardScreen onBack={() => handleNavigate('home')} />;
      
      case 'profile':
        return <ProfileScreen onBack={() => handleNavigate('home')} />;
      
      case 'settings':
        return (
          <SettingsScreen 
            onBack={() => handleNavigate('home')} 
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        );
      
      case 'teacher':
        return <TeacherDashboard onBack={() => handleNavigate('home')} />;
      
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="size-full">
      {renderScreen()}
      <Toaster />
    </div>
  );
}
