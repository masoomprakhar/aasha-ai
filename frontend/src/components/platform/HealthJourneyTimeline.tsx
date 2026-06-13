import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export interface JourneyStep {
  id: string;
  title: string;
  date?: string;
  done?: boolean;
}

interface HealthJourneyTimelineProps {
  steps: JourneyStep[];
}

export function HealthJourneyTimeline({ steps }: HealthJourneyTimelineProps) {
  return (
    <div className="ui-card p-6">
      <h3 className="text-[16px] font-semibold text-ink mb-5">Health Journey</h3>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-4 relative"
          >
            {i < steps.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
            )}
            <div className="shrink-0 mt-0.5">
              {step.done ? (
                <CheckCircle2 className="w-6 h-6 text-brand" />
              ) : (
                <Circle className="w-6 h-6 text-border" />
              )}
            </div>
            <div className="pb-6 min-w-0">
              <p className="text-[14px] font-medium text-ink">{step.title}</p>
              {step.date && <p className="text-[12px] text-muted mt-0.5">{step.date}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
