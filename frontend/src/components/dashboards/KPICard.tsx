import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function KPICard({ title, value, description, icon, className }: Props) {
  return (
    <div className={cn('bg-white rounded-lg shadow p-5 flex items-start gap-4', className)}>
      {icon && <div className="text-primary mt-1">{icon}</div>}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
}