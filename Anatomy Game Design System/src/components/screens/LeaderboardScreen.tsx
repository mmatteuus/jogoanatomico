import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockLeaderboard } from '../../lib/mock-data';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('Gold')) return 'text-yellow-500';
    if (tier.includes('Silver')) return 'text-gray-400';
    if (tier.includes('Bronze')) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>Ranking</h2>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 pb-24">
        <Tabs defaultValue="global" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="school">Escola</TabsTrigger>
            <TabsTrigger value="friends">Amigos</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            {/* Season Info */}
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Temporada 1</h3>
                  <p className="text-sm text-muted-foreground">Termina em 23 dias</p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </Card>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center pt-8">
                <div className="text-3xl mb-2">{mockLeaderboard[1].avatar}</div>
                <div className="text-xs text-center mb-1">{mockLeaderboard[1].name}</div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-t-lg p-3 text-center">
                  <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm">{mockLeaderboard[1].xp}</div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">{mockLeaderboard[0].avatar}</div>
                <div className="text-xs text-center mb-1">{mockLeaderboard[0].name}</div>
                <div className="w-full bg-yellow-300 dark:bg-yellow-600 rounded-t-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-200 mx-auto mb-1" />
                  <div>{mockLeaderboard[0].xp}</div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center pt-12">
                <div className="text-3xl mb-2">{mockLeaderboard[2].avatar}</div>
                <div className="text-xs text-center mb-1">{mockLeaderboard[2].name}</div>
                <div className="w-full bg-amber-300 dark:bg-amber-700 rounded-t-lg p-2 text-center">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-200 mx-auto mb-1" />
                  <div className="text-xs">{mockLeaderboard[2].xp}</div>
                </div>
              </div>
            </div>

            {/* Rest of Rankings */}
            <div className="space-y-2">
              {mockLeaderboard.slice(3).map((player) => (
                <Card
                  key={player.rank}
                  className={`p-4 ${player.rank === 9 ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {getRankIcon(player.rank)}
                    </div>
                    <div className="text-2xl">{player.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{player.name}</span>
                        {player.rank === 9 && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Você
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${getTierColor(player.tier)}`}>
                        {player.tier}
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{player.xp}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="school">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Conecte-se com sua escola para ver o ranking
              </p>
              <Button className="mt-4">Conectar Escola</Button>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Adicione amigos para competir
              </p>
              <Button className="mt-4">Adicionar Amigos</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
