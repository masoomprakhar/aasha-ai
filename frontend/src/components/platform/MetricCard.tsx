import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  onClick?: () => void;
  trend?: string;
  compact?: boolean;
}

export function MetricCard({ label, value, subtitle, icon: Icon, onClick, trend, compact }: MetricCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } } : undefined}
      onClick={onClick}
      className={`ui-card ${compact ? 'p-3' : 'p-5 sm:p-6'} h-full saas-hover-lift ${onClick ? 'cursor-pointer group' : ''}`}
    >
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-5'}`}>
        <div className={`rounded-card bg-brand-wash flex items-center justify-center text-brand ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} strokeWidth={1.75} />
        </div>
        {onClick && (
          <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-brand transition-colors" />
        )}
      </div>
      <p className={`font-medium text-muted ${compact ? 'text-[10px] mb-0.5' : 'text-[12px] mb-1'}`}>{subtitle || label}</p>
      <p className={`font-semibold text-ink tracking-tight ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>{value}</p>
      {!compact && <p className="text-[14px] font-medium text-ink mt-1">{label}</p>}
      {trend && <p className={`text-success font-medium ${compact ? 'text-[10px] mt-1' : 'text-[12px] mt-2'}`}>{trend}</p>}
    </motion.div>
  );
}
