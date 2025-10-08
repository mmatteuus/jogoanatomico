import { ArrowLeft, Lock, CheckCircle2, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { mockCampaigns } from '../../lib/mock-data';

interface CampaignScreenProps {
  onBack: () => void;
  onStartLesson: () => void;
}

export function CampaignScreen({ onBack, onStartLesson }: CampaignScreenProps) {
  const getSystemColor = (system: string) => {
    switch (system) {
      case 'skeletal': return 'bg-gray-500';
      case 'muscular': return 'bg-red-500';
      case 'nervous': return 'bg-purple-500';
      case 'vascular': return 'bg-rose-500';
      default: return 'bg-primary';
    }
  };

  const getSystemIcon = (system: string) => {
    switch (system) {
      case 'skeletal': return '🦴';
      case 'muscular': return '💪';
      case 'nervous': return '🧠';
      case 'vascular': return '❤️';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2>Campanha</h2>
              <p className="text-sm text-muted-foreground">Progressão por sistemas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4 pb-24">
        {/* Map Progress */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3>Sua Jornada</h3>
              <span className="text-sm text-muted-foreground">53% completo</span>
            </div>
            <Progress value={53} className="h-2" />
          </CardContent>
        </Card>

        {/* Campaign List */}
        <div className="space-y-6">
          {mockCampaigns.map((campaign, index) => (
            <div key={campaign.id} className="relative">
              {/* Connector Line */}
              {index < mockCampaigns.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-12 bg-border" />
              )}

              <Card className={campaign.unlocked ? 'hover:shadow-md transition-shadow' : 'opacity-60'}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl ${getSystemColor(campaign.system)} bg-opacity-10 flex items-center justify-center text-3xl flex-shrink-0`}>
                      {campaign.unlocked ? getSystemIcon(campaign.system) : <Lock className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle>{campaign.title}</CardTitle>
                          <CardDescription>
                            {campaign.completedLessons}/{campaign.totalLessons} lições
                          </CardDescription>
                        </div>
                        {campaign.progress === 100 && (
                          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={campaign.progress} className="mb-4 h-2" />
                  <Button
                    className="w-full"
                    disabled={!campaign.unlocked}
                    onClick={onStartLesson}
                  >
                    {campaign.unlocked ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {campaign.progress === 0 ? 'Começar' : 'Continuar'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Bloqueado
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Complete cada campanha para desbloquear a próxima e ganhar badges exclusivos!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
