import type { LucideIcon } from 'lucide-react';

interface ImpactMetricsCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
}

export function ImpactMetricsCard({ label, value, change, icon: Icon }: ImpactMetricsCardProps) {
  return (
    <div className="ui-card p-5">
      <div className="w-9 h-9 rounded-lg bg-brand-wash flex items-center justify-center text-brand mb-4">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-semibold text-ink tracking-tight">{value}</p>
      <p className="text-[12px] font-medium text-muted mt-1">{label}</p>
      {change && <p className="text-[11px] text-success font-medium mt-2">{change}</p>}
    </div>
  );
}
