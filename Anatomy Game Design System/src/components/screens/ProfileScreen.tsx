import { ArrowLeft, Trophy, Flame, Target, Award, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockUser, mockBadges } from '../../lib/mock-data';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>Perfil</h2>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4 pb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h3>Estudante Anatomia</h3>
              <p className="text-muted-foreground">Nível {mockUser.level}</p>
            </div>

            {/* XP Progress */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">XP</span>
                <span>{mockUser.xp} / 3000</span>
              </div>
              <Progress value={(mockUser.xp / 3000) * 100} className="h-3" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-xl">{mockUser.rank}</div>
                <div className="text-xs text-muted-foreground">Elo</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <div className="text-xl">{mockUser.streak}</div>
                <div className="text-xs text-muted-foreground">Sequência</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-1" />
                <div className="text-xl">89%</div>
                <div className="text-xs text-muted-foreground">Acertos</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            {/* System Mastery */}
            <Card>
              <CardHeader>
                <CardTitle>Domínio por Sistema</CardTitle>
                <CardDescription>Seu progresso em cada sistema anatômico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockUser.systemProgress).map(([system, progress]) => (
                  <div key={system}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="capitalize">{system}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm">Sprint - Sistema Esquelético</p>
                      <p className="text-xs text-muted-foreground">8/10 corretas · +400 XP</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Hoje</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm">Campanha - Osteologia</p>
                      <p className="text-xs text-muted-foreground">Lição 18 completa · +200 XP</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Ontem</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {mockBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={badge.earned ? 'bg-gradient-to-br from-primary/5 to-primary/10' : 'opacity-50'}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">
                      {badge.earned ? '🏆' : '🔒'}
                    </div>
                    <h4 className="mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Histórico completo de atividades em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
