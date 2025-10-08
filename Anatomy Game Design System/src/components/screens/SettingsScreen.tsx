import { ArrowLeft, Moon, Sun, Globe, Volume2, Palette, Accessibility } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SettingsScreenProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsScreen({ onBack, darkMode, onToggleDarkMode }: SettingsScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>Configurações</h2>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aparência
            </CardTitle>
            <CardDescription>Personalize a aparência do aplicativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Modo Escuro
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>

            <div className="space-y-2">
              <Label>Tamanho da Fonte</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequena</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="xlarge">Extra Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              Acessibilidade
            </CardTitle>
            <CardDescription>Opções para melhorar a acessibilidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="cursor-pointer">
                Alto Contraste
              </Label>
              <Switch id="high-contrast" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="colorblind" className="cursor-pointer">
                Modo Daltônico
              </Label>
              <Switch id="colorblind" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion" className="cursor-pointer">
                Reduzir Movimento
              </Label>
              <Switch id="reduce-motion" />
            </div>

            <div className="space-y-2">
              <Label>Preferência de Mão</Label>
              <Select defaultValue="right">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">Destro</SelectItem>
                  <SelectItem value="left">Canhoto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Idioma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="pt-BR">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Audio & Haptics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Áudio e Vibração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="cursor-pointer">
                Efeitos Sonoros
              </Label>
              <Switch id="sound-effects" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="haptics" className="cursor-pointer">
                Feedback Tátil
              </Label>
              <Switch id="haptics" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Study Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Estudo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="timer" className="cursor-pointer">
                Mostrar Timer
              </Label>
              <Switch id="timer" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label>Meta Diária</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-2xl">🏥</p>
            <h3>Anatomia Pro</h3>
            <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full">Termos de Uso</Button>
              <Button variant="outline" className="w-full">Política de Privacidade</Button>
              <Button variant="outline" className="w-full">Ajuda e Suporte</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
