import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, Stethoscope, Users } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (profile: string) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const profiles = [
    {
      id: 'student',
      icon: GraduationCap,
      title: 'Estudante',
      description: 'Aprendendo anatomia pela primeira vez',
    },
    {
      id: 'professional',
      icon: Stethoscope,
      title: 'Profissional',
      description: 'Revisando e aprofundando conhecimentos',
    },
    {
      id: 'professor',
      icon: Users,
      title: 'Professor',
      description: 'Criando aulas e acompanhando alunos',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl">Bem-vindo ao Anatomia Pro</h1>
          <p className="text-muted-foreground">
            Selecione seu perfil para começar sua jornada
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => onComplete(profile.id)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <profile.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{profile.title}</CardTitle>
                <CardDescription>{profile.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => onComplete('guest')}>
            Continuar como convidado
          </Button>
        </div>
      </div>
    </div>
  );
}
