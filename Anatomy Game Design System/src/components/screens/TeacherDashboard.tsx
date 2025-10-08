import { ArrowLeft, Users, BookOpen, BarChart3, Plus, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface TeacherDashboardProps {
  onBack: () => void;
}

export function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const classes = [
    { id: '1', name: 'Anatomia I - Turma A', students: 45, code: 'ANAT2024A' },
    { id: '2', name: 'Anatomia II - Turma B', students: 38, code: 'ANAT2024B' },
  ];

  const studentPerformance = [
    { name: 'Ana Silva', skeletal: 95, muscular: 88, nervous: 76, avg: 86 },
    { name: 'Carlos Med', skeletal: 82, muscular: 79, nervous: 85, avg: 82 },
    { name: 'Julia Santos', skeletal: 78, muscular: 84, nervous: 72, avg: 78 },
    { name: 'Pedro Costa', skeletal: 70, muscular: 68, nervous: 65, avg: 68 },
  ];

  const assignments = [
    { id: '1', title: 'Sprint - Sistema Esquelético', due: '2 dias', completed: 32, total: 45 },
    { id: '2', title: 'Campanha - Osteologia', due: '5 dias', completed: 28, total: 45 },
    { id: '3', title: 'OSCE - Membros Inferiores', due: '1 semana', completed: 15, total: 45 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2>Painel do Professor</h2>
                <p className="text-sm text-muted-foreground">Gerencie suas turmas e atribuições</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Turma
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 pb-24">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">83</div>
              <p className="text-xs text-muted-foreground">Em 2 turmas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades Ativas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Com prazos próximos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-green-600">+2.3% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="classes">Turmas</TabsTrigger>
            <TabsTrigger value="assignments">Atividades</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-4">
            {classes.map((classItem) => (
              <Card key={classItem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{classItem.name}</CardTitle>
                      <CardDescription>
                        {classItem.students} alunos · Código: {classItem.code}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Atividade
              </Button>
            </div>

            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{assignment.title}</CardTitle>
                      <CardDescription>Prazo: {assignment.due}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completaram:</span>
                      <span>{assignment.completed}/{assignment.total} alunos</span>
                    </div>
                    <Progress value={(assignment.completed / assignment.total) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Desempenho por Sistema</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
                <CardDescription>Média de acertos por aluno</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentPerformance.map((student) => (
                    <div key={student.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{student.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Média: {student.avg}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Esquelético</span>
                            <span>{student.skeletal}%</span>
                          </div>
                          <Progress value={student.skeletal} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Muscular</span>
                            <span>{student.muscular}%</span>
                          </div>
                          <Progress value={student.muscular} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Nervoso</span>
                            <span>{student.nervous}%</span>
                          </div>
                          <Progress value={student.nervous} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Heatmap Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Calor - Estruturas Mais Erradas</CardTitle>
                <CardDescription>Identificar áreas que precisam de reforço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-12 rounded ${
                        i % 5 === 0
                          ? 'bg-red-500/80'
                          : i % 3 === 0
                          ? 'bg-yellow-500/60'
                          : 'bg-green-500/40'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>Menos erros</span>
                  <span>Mais erros</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
