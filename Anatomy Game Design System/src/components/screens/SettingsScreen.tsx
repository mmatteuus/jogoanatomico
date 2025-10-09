import { ArrowLeft, Moon, Sun } from 'lucide-react';

import { User } from '../../lib/api-types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';

interface SettingsScreenProps {
  user: User;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

export function SettingsScreen({ user, darkMode, onToggleDarkMode, onBack }: SettingsScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">Configuracoes</h2>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Dados basicos do seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div><span className="text-foreground font-medium">Nome:</span> {user.display_name}</div>
            <div><span className="text-foreground font-medium">E-mail:</span> {user.email ?? 'nao informado'}</div>
            <div><span className="text-foreground font-medium">Tipo de perfil:</span> {user.profile_type}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>Personalize a aparencia do aplicativo</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium text-foreground">Modo escuro</p>
                <p className="text-xs text-muted-foreground">Alterna automaticamente a paleta para ambientes com pouca luz.</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Jogo de Anatomia  -  versao 1.0.0</p>
            <p>Desenvolvido por MtsFerreira</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
