import { FormEvent, useState } from 'react';
import { Mail, Lock, User, GraduationCap, Stethoscope, Users } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../hooks/useAuth';
import { RegisterPayload } from '../../lib/api-types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type ProfileOption = {
  label: string;
  value: RegisterPayload['profile_type'];
  description: string;
  icon: JSX.Element;
};

const PROFILE_OPTIONS: ProfileOption[] = [
  {
    label: 'Estudante',
    value: 'student',
    description: 'Aprendendo anatomia',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    label: 'Profissional',
    value: 'professional',
    description: 'Revisando conteudos',
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    label: 'Professor',
    value: 'professor',
    description: 'Acompanhando turmas',
    icon: <Users className="w-5 h-5" />,
  },
];

export function AuthScreen() {
  const { login, register, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [profile, setProfile] = useState<RegisterPayload['profile_type']>('student');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    if (!email || !password) {
      toast.error('Informe e-mail e senha');
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel entrar';
      toast.error(message);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: RegisterPayload = {
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || ''),
      display_name: String(formData.get('display_name') || '').trim(),
      profile_type: profile,
    };

    if (!payload.email || !payload.password || !payload.display_name) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await register(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel concluir o cadastro';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl border border-border/60 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold">Jogo de Anatomia</CardTitle>
          <CardDescription>Desenvolvido por MtsFerreira</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="login-email" name="email" type="email" className="pl-9" placeholder="nome@exemplo.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="login-password" name="password" type="password" className="pl-9" placeholder="********" />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome exibido</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="register-name" name="display_name" className="pl-9" placeholder="Como voce quer ser chamado" />
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="register-email" name="email" type="email" className="pl-9" placeholder="nome@exemplo.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="register-password" name="password" type="password" className="pl-9" placeholder="minimo 8 caracteres" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Selecione seu perfil</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {PROFILE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setProfile(option.value)}
                        className={`border rounded-xl p-4 text-left transition-all ${
                          profile === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="p-2 rounded-lg bg-primary/10 text-primary">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
