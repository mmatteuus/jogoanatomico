import { useState } from 'react';
import { ArrowLeft, Award, Medal, Trophy } from 'lucide-react';

import { LeaderboardResponse } from '../../lib/api-types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface LeaderboardScreenProps {
  data: LeaderboardResponse | null;
  token: string;
  onBack: () => void;
  onScopeChange: (scope: string) => Promise<void>;
}

const SCOPES: { value: string; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'organization', label: 'Instituicao' },
  { value: 'friends', label: 'Amigos' },
];

export function LeaderboardScreen({ data, onBack, onScopeChange }: LeaderboardScreenProps) {
  const [scope, setScope] = useState<string>('global');

  const handleScopeChange = async (value: string) => {
    setScope(value);
    await onScopeChange(value);
  };

  const entries = data?.entries ?? [];
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-500" />;
    return <span className="text-sm text-muted-foreground font-semibold">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">Ranking</h2>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4 pb-24">
        <Tabs value={scope} onValueChange={handleScopeChange} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            {SCOPES.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={scope} className="space-y-4">
            {entries.length === 0 ? (
              <Card className="p-6 text-sm text-muted-foreground">
                Ainda nao ha participantes neste ranking.
              </Card>
            ) : (
              <>
                <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold">Temporada ativa</h3>
                      <p className="text-xs text-muted-foreground">
                        Atualizado em {new Date(data!.generated_at).toLocaleString()}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {topThree.map((entry) => (
                    <Card key={entry.user_id} className="p-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">#{entry.rank}</div>
                      <div className="text-lg font-semibold">{entry.display_name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{entry.xp} XP</div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  {rest.map((entry) => (
                    <Card key={entry.user_id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 flex justify-center">{renderRankIcon(entry.rank)}</div>
                        <div className="flex-1">
                          <div className="font-medium">{entry.display_name}</div>
                          <div className="text-xs text-muted-foreground">Streak {entry.streak} dias</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{entry.xp} XP</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
