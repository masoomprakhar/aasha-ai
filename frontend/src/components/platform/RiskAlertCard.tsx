import { AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskAlertCardProps {
  name: string;
  detail: string;
  severity?: 'critical' | 'high' | 'medium';
  time?: string;
  onClick?: () => void;
}

const styles = {
  critical: 'border-l-critical bg-red-50/80',
  high: 'border-l-warning bg-amber-50/60',
  medium: 'border-l-brand bg-brand-wash/40',
};

export function RiskAlertCard({ name, detail, severity = 'high', time, onClick }: RiskAlertCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { x: 2 } : undefined}
      onClick={onClick}
      className={`ui-card border-l-4 p-5 flex items-center justify-between gap-4 ${styles[severity]} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <AlertCircle className={`w-5 h-5 shrink-0 ${severity === 'critical' ? 'text-critical' : severity === 'high' ? 'text-warning' : 'text-brand'}`} />
        <div>
          <h4 className="text-[15px] font-semibold text-ink">{name}</h4>
          <p className="text-[13px] text-muted mt-0.5">{detail}</p>
          {time && <p className="text-[12px] text-faint mt-1">{time}</p>}
        </div>
      </div>
      {onClick && <ChevronRight className="w-5 h-5 text-faint shrink-0" />}
    </motion.div>
  );
}
