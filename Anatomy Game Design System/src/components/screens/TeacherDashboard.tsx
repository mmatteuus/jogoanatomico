import { ArrowLeft, BookOpen, GraduationCap, Users } from 'lucide-react';

import { Campaign, LeaderboardResponse } from '../../lib/api-types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TeacherDashboardProps {
  campaigns: Campaign[];
  leaderboard: LeaderboardResponse | null;
  onBack: () => void;
}

export function TeacherDashboard({ campaigns, leaderboard, onBack }: TeacherDashboardProps) {
  const topStudents = leaderboard?.entries.slice(0, 5) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Painel do Professor</h2>
              <p className="text-sm text-muted-foreground">Resumo rapido das campanhas e ranking dos alunos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex items-center gap-3 pb-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm font-medium">Alunos monitorados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{leaderboard?.entries.length ?? 0}</div>
              <CardDescription>Participando do ranking atual</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3 pb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm font-medium">Campanhas disponiveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{campaigns.length}</div>
              <CardDescription>Sequencias prontas para seus alunos</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3 pb-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm font-medium">Melhor desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              {topStudents[0] ? (
                <>
                  <div className="text-lg font-semibold">{topStudents[0].display_name}</div>
                  <CardDescription>{topStudents[0].xp} XP acumulados</CardDescription>
                </>
              ) : (
                <CardDescription>Nenhum aluno registrado ainda.</CardDescription>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campanhas ativas</CardTitle>
            <CardDescription>Conteudos estruturados por sistema anatomico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma campanha cadastrada. Cadastre conteudos no backend para disponibiliza-los aos alunos.
              </p>
            )}
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{campaign.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.lessons.length} licoes  -  Sistema: {campaign.anatomy_system}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{campaign.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top alunos</CardTitle>
            <CardDescription>Ranking atualizado da temporada atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {topStudents.length === 0 && (
              <p className="text-sm text-muted-foreground">Ainda nao ha alunos suficientes no ranking.</p>
            )}
            {topStudents.map((entry) => (
              <div key={entry.user_id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium">{entry.display_name}</div>
                  <div className="text-xs text-muted-foreground">Streak {entry.streak} dias</div>
                </div>
                <div className="text-sm text-muted-foreground">{entry.xp} XP</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
