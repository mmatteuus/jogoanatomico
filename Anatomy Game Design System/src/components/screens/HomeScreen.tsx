import {
  BarChart3,
  Brain,
  Flame,
  Globe,
  Map,
  Microscope,
  PlayCircle,
  Rocket,
  Target,
  Trophy,
  Zap,
  Sun,
} from 'lucide-react';

import { DashboardSummary, User } from '../../lib/api-types';
import { GameModeCard } from '../GameModeCard';
import { StatCard } from '../StatCard';
import { SystemProgressCard } from '../SystemProgressCard';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

function BoneIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.9 19.1 19.1 4.9" />
      <path d="m14.1 4.9 5 5" />
      <path d="m4.9 14.1 5 5" />
    </svg>
  );
}

function FlexIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 18a3 3 0 0 0 3-3v-1h-4" />
      <path d="M6 12H2v1a3 3 0 0 0 3 3" />
      <path d="M9 12a4 4 0 0 1 4-4h1" />
      <path d="M15 12a4 4 0 0 0-4 4v1" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 14c-1.5 2-3.5 3-7 6-3.5-3-5.5-4-7-6a4 4 0 1 1 7-4 4 4 0 1 1 7 4z" />
    </svg>
  );
}

const SYSTEM_META: Record<string, { label: string; color: string; icon: JSX.Element }> = {
  skeletal: {
    label: 'Sistema Esqueletico',
    color: 'bg-slate-500',
    icon: <BoneIcon />,
  },
  muscular: {
    label: 'Sistema Muscular',
    color: 'bg-red-500',
    icon: <FlexIcon />,
  },
  nervous: {
    label: 'Sistema Nervoso',
    color: 'bg-purple-500',
    icon: <Brain className="w-5 h-5 text-white" />,
  },
  vascular: {
    label: 'Sistema Vascular',
    color: 'bg-rose-500',
    icon: <HeartIcon />,
  },
};

interface HomeScreenProps {
  user: User;
  dashboard: DashboardSummary | null;
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ user, dashboard, onNavigate }: HomeScreenProps) {
  const missions = dashboard?.missions ?? [];
  const systemProgress = dashboard?.systems ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Anatomia Pro</h1>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
              <Sun className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <StatCard icon={Trophy} label="XP" value={user.xp} color="text-yellow-500" />
            <StatCard icon={Target} label="Elo" value={user.elo_rating} color="text-purple-500" />
            <StatCard icon={Flame} label="Sequencia" value={`${user.streak} dias`} color="text-orange-500" />
            <StatCard icon={Zap} label="Energia" value={`${user.energy}/5`} color="text-blue-500" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 pb-24">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Missoes do dia</h2>
          <div className="grid gap-3">
            {missions.length === 0 && (
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                  Complete uma sessao para receber novas missoes personalizadas.
                </CardContent>
              </Card>
            )}
            {missions.map((mission) => (
              <Card key={mission.mission_id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{mission.title}</span>
                    <span className="text-sm text-primary font-medium">+{mission.xp_reward} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(mission.progress / mission.target) * 100} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {mission.progress}/{mission.target}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Modos de jogo</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <GameModeCard
              icon={Rocket}
              title="Sprint"
              description="Desafio de 60 segundos para revisar estruturas"
              color="bg-sky-500"
              onPlay={() => onNavigate('sprint')}
            />
            <GameModeCard
              icon={Map}
              title="Campanha"
              description="Avance pelo mapa de sistemas"
              color="bg-purple-500"
              onPlay={() => onNavigate('campaign')}
            />
            <GameModeCard
              icon={Microscope}
              title="OSCE"
              description="Estacoes clinicas integradas"
              color="bg-green-500"
              onPlay={() => onNavigate('osce')}
            />
            <GameModeCard
              icon={Globe}
              title="Explorar 3D"
              description="Visualizacao anatomica interativa"
              color="bg-cyan-500"
              onPlay={() => onNavigate('3d-explorer')}
            />
            <GameModeCard
              icon={Brain}
              title="Revisao Inteligente"
              description="Repeticao espacada das estruturas"
              color="bg-pink-500"
              onPlay={() => onNavigate('srs')}
            />
            <GameModeCard
              icon={BarChart3}
              title="Ranking"
              description="Compare seu desempenho com outros alunos"
              color="bg-orange-500"
              onPlay={() => onNavigate('leaderboard')}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Progresso por sistema</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {systemProgress.map((system) => {
              const meta = SYSTEM_META[system.system] ?? {
                label: system.system,
                color: 'bg-primary',
                icon: <PlayCircle className="w-5 h-5 text-white" />,
              };
              return (
                <SystemProgressCard
                  key={system.system}
                  system={meta.label}
                  progress={Math.round(system.completion_rate * 100)}
                  color={meta.color}
                  icon={meta.icon}
                />
              );
            })}
            {systemProgress.length === 0 && (
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                  Complete quizzes para liberar o acompanhamento de sistemas.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Continuar aprendendo</h2>
          <Card>
            <CardContent className="space-y-3 p-4">
              <CardTitle className="text-base">Comece uma campanha</CardTitle>
              <Progress value={dashboard ? (dashboard.missions.length / 3) * 100 : 0} className="h-2" />
              <Button className="w-full" onClick={() => onNavigate('campaign')}>
                Explorar campanhas
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2">
            <Target className="w-5 h-5" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2" onClick={() => onNavigate('campaign')}>
            <PlayCircle className="w-5 h-5" />
            <span className="text-xs">Campanha</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2" onClick={() => onNavigate('leaderboard')}>
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Ranking</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2" onClick={() => onNavigate('profile')}>
            <Sun className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
