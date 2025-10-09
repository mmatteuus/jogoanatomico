import { ArrowLeft, Flame, Medal, Target, TrendingUp, Trophy } from 'lucide-react';

import { ProfileSummary } from '../../lib/api-types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface ProfileScreenProps {
  summary: ProfileSummary | null;
  onBack: () => void;
}

export function ProfileScreen({ summary, onBack }: ProfileScreenProps) {
  const user = summary?.user;
  const systemProgress = summary?.systems_progress ?? {};

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">Perfil</h2>
          </div>

          {user ? (
            <div className="flex flex-col items-center text-center space-y-4 pb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-semibold text-white">
                {user.display_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.display_name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.profile_type}</p>
              </div>
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                  <span>XP total</span>
                  <span>{user.xp.toLocaleString('pt-BR')} XP</span>
                </div>
                <Progress value={Math.min((user.xp % 5000) / 50, 100)} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{user.elo_rating}</div>
                  <div className="text-xs text-muted-foreground">Elo</div>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{user.streak}</div>
                  <div className="text-xs text-muted-foreground">Sequencia</div>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <Target className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{summary?.daily_missions_completed ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Missoes hoje</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center pb-6">
              Carregando informacoes do perfil...
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Dominio por sistema</CardTitle>
            <CardDescription>Acompanhe sua evolucao em cada trilha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(systemProgress).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete quizzes para gerar estatisticas de progresso.
              </p>
            ) : (
              Object.entries(systemProgress).map(([system, value]) => (
                <div key={system}>
                  <div className="flex justify-between text-sm mb-1 capitalize">
                    <span>{system}</span>
                    <span>{Math.round(value * 100)}%</span>
                  </div>
                  <Progress value={value * 100} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Resumo das ultimas conquistas registradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Novas missoes concluidas</p>
                <p className="text-xs text-muted-foreground">
                  {summary?.daily_missions_completed ?? 0} missoes diarias  -  {summary?.weekly_missions_completed ?? 0} semanais
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <Medal className="w-5 h-5 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Streak atual</p>
                <p className="text-xs text-muted-foreground">{user?.streak ?? 0} dias consecutivos estudando</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
