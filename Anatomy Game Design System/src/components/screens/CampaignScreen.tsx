import { ArrowLeft, BookOpenCheck } from 'lucide-react';

import { Campaign } from '../../lib/api-types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface CampaignScreenProps {
  token: string;
  campaigns: Campaign[];
  onBack: () => void;
  onStartLesson: () => void;
}

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500', 'bg-orange-500'];

export function CampaignScreen({ campaigns, onBack, onStartLesson }: CampaignScreenProps) {
  const items = campaigns.map((campaign, index) => ({
    ...campaign,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Campanhas</h2>
              <p className="text-sm text-muted-foreground">Percorra sequencias guiadas para dominar cada sistema.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4 pb-24">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Ainda nao ha campanhas registradas. Cadastre aulas no backend para disponibiliza-las aos alunos.
            </CardContent>
          </Card>
        ) : (
          items.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow transition-shadow">
              <CardHeader className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-lg ${campaign.color} bg-opacity-10 flex items-center justify-center`}>
                  <BookOpenCheck className={`${campaign.color.replace('bg-', 'text-')} w-6 h-6`} />
                </div>
                <div className="flex-1">
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  {campaign.lessons.length} licoes  -  Sistema: {campaign.anatomy_system}
                </div>
                <Button className="w-full" onClick={onStartLesson}>
                  Iniciar
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
