import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatCard({ icon: Icon, label, value, color = 'text-primary', size = 'md' }: StatCardProps) {
  return (
    <div className="flex items-center gap-2 bg-card rounded-lg p-3 border border-border">
      <div className={`${color} flex-shrink-0`}>
        <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className={size === 'lg' ? 'text-lg' : ''}>{value}</span>
      </div>
    </div>
  );
}
