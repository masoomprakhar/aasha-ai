import { motion } from 'framer-motion';

interface PregnancyTimelineProps {
  week: number;
  totalWeeks?: number;
  edd?: string;
  compact?: boolean;
}

export function PregnancyTimeline({ week, totalWeeks = 40, edd, compact }: PregnancyTimelineProps) {
  const pct = Math.min(100, Math.round((week / totalWeeks) * 100));

  return (
    <div className={`ui-card ${compact ? 'p-3' : 'p-6'}`}>
      <div className={`flex justify-between items-baseline ${compact ? 'mb-2' : 'mb-4'}`}>
        <h3 className={`font-semibold text-ink ${compact ? 'text-sm' : 'text-[16px]'}`}>Pregnancy Progress</h3>
        <span className="text-caption text-muted">Week {week} of {totalWeeks}</span>
      </div>
      <div className={`h-1.5 rounded-pill bg-border overflow-hidden ${compact ? 'mb-1.5' : 'mb-3'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-pill bg-brand"
        />
      </div>
      {edd && <p className="text-caption text-muted">Due <span className="text-ink font-medium">{edd}</span></p>}
    </div>
  );
}
