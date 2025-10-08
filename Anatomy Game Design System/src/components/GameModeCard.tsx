import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface GameModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onPlay: () => void;
  disabled?: boolean;
}

export function GameModeCard({ icon: Icon, title, description, color, onPlay, disabled }: GameModeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-2 ${color}`} />
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            <Icon className="w-6 h-6" style={{ color: color.replace('bg-', '') }} />
          </div>
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={onPlay} className="w-full" disabled={disabled}>
          Jogar
        </Button>
      </CardContent>
    </Card>
  );
}
