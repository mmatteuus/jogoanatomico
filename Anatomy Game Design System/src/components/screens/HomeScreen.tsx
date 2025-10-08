import { Trophy, Flame, Zap, Target, Brain, Map, Globe, Microscope, BookOpen, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { StatCard } from '../StatCard';
import { GameModeCard } from '../GameModeCard';
import { SystemProgressCard } from '../SystemProgressCard';
import { mockUser, mockDailyMissions, mockCampaigns } from '../../lib/mock-data';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1>Anatomia Pro</h1>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
              ⚙️
            </Button>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <StatCard icon={Trophy} label="XP" value={mockUser.xp} color="text-yellow-500" />
            <StatCard icon={Target} label="Elo" value={mockUser.rank} color="text-purple-500" />
            <StatCard icon={Flame} label="Sequência" value={`${mockUser.streak}d`} color="text-orange-500" />
            <StatCard icon={Zap} label="Energia" value={`${mockUser.energy}/5`} color="text-blue-500" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 pb-24">
        {/* Daily Missions */}
        <section>
          <h2 className="mb-4">Missões Diárias</h2>
          <div className="grid gap-3">
            {mockDailyMissions.map((mission) => (
              <Card key={mission.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>{mission.title}</span>
                    <span className="text-sm text-primary">+{mission.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(mission.progress / mission.total) * 100} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground">
                      {mission.progress}/{mission.total}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Game Modes */}
        <section>
          <h2 className="mb-4">Modos de Jogo</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <GameModeCard
              icon={Zap}
              title="Sprint"
              description="60s de identificação rápida"
              color="bg-blue-500"
              onPlay={() => onNavigate('sprint')}
            />
            <GameModeCard
              icon={Map}
              title="Campanha"
              description="Progressão por sistemas"
              color="bg-purple-500"
              onPlay={() => onNavigate('campaign')}
            />
            <GameModeCard
              icon={Microscope}
              title="OSCE Clínico"
              description="Estações clínicas integradas"
              color="bg-green-500"
              onPlay={() => onNavigate('osce')}
            />
            <GameModeCard
              icon={Globe}
              title="Explorar 3D"
              description="Visualizador anatômico"
              color="bg-cyan-500"
              onPlay={() => onNavigate('3d-explorer')}
            />
            <GameModeCard
              icon={Brain}
              title="Revisão Inteligente"
              description="Sistema de repetição espaçada"
              color="bg-pink-500"
              onPlay={() => onNavigate('srs')}
            />
            <GameModeCard
              icon={BarChart3}
              title="Ranking"
              description="Compare seu progresso"
              color="bg-orange-500"
              onPlay={() => onNavigate('leaderboard')}
            />
          </div>
        </section>

        {/* System Progress */}
        <section>
          <h2 className="mb-4">Progresso por Sistema</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <SystemProgressCard
              system="Sistema Esquelético"
              progress={mockUser.systemProgress.skeletal}
              color="bg-gray-500"
              icon="🦴"
            />
            <SystemProgressCard
              system="Sistema Muscular"
              progress={mockUser.systemProgress.muscular}
              color="bg-red-500"
              icon="💪"
            />
            <SystemProgressCard
              system="Sistema Nervoso"
              progress={mockUser.systemProgress.nervous}
              color="bg-purple-500"
              icon="🧠"
            />
            <SystemProgressCard
              system="Sistema Vascular"
              progress={mockUser.systemProgress.vascular}
              color="bg-rose-500"
              icon="❤️"
            />
          </div>
        </section>

        {/* Continue Campaign */}
        <section>
          <h2 className="mb-4">Continuar de onde parou</h2>
          <Card>
            <CardHeader>
              <CardTitle>Osteologia - Membros Inferiores</CardTitle>
              <CardDescription>Lição 18 de 24</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={75} className="mb-4" />
              <Button className="w-full">Continuar</Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2">
            <Target className="w-5 h-5" />
            <span className="text-xs">Início</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2" onClick={() => onNavigate('campaign')}>
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Aprender</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2" onClick={() => onNavigate('leaderboard')}>
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Ranking</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2" onClick={() => onNavigate('profile')}>
            <span className="text-xl">👤</span>
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
