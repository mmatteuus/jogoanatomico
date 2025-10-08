import { Progress } from './ui/progress';

interface SystemProgressCardProps {
  system: string;
  progress: number;
  color: string;
  icon: string;
}

export function SystemProgressCard({ system, progress, color, icon }: SystemProgressCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`text-2xl w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{system}</h4>
          <p className="text-sm text-muted-foreground">{progress}% completo</p>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
