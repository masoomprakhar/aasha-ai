import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface HealthStatusCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onClick?: () => void;
  accent?: 'brand' | 'success' | 'warning' | 'critical';
  compact?: boolean;
}

const accentMap = {
  brand: 'border-l-brand bg-canvas',
  success: 'border-l-success bg-canvas',
  warning: 'border-l-warning bg-canvas',
  critical: 'border-l-critical bg-canvas',
};

const iconMap = {
  brand: 'bg-canvas border border-border text-brand',
  success: 'bg-canvas border border-border text-success',
  warning: 'bg-canvas border border-border text-warning',
  critical: 'bg-canvas border border-border text-critical',
};

export function HealthStatusCard({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  onClick,
  accent = 'brand',
  compact,
}: HealthStatusCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`ui-card border-l-4 ${compact ? 'p-3.5' : 'p-6 sm:p-7'} ${accentMap[accent]} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-medium text-muted ${compact ? 'text-[11px] mb-1' : 'text-[12px] mb-2'}`}>{eyebrow}</p>
          <h3 className={`font-semibold text-ink tracking-tight ${compact ? 'text-2xl mb-0.5' : 'text-3xl sm:text-4xl mb-1'}`}>{title}</h3>
          <p className={compact ? 'text-caption text-muted' : 'text-[15px] text-muted'}>{subtitle}</p>
        </div>
        <div className={`rounded-card flex items-center justify-center shrink-0 ${compact ? 'w-10 h-10' : 'w-12 h-12'} ${iconMap[accent]}`}>
          <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} strokeWidth={1.75} />
        </div>
      </div>
    </motion.div>
  );
}
