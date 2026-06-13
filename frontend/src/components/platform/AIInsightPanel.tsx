import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Insight {
  id: string;
  text: string;
  priority?: 'high' | 'medium' | 'low';
}

interface AIInsightPanelProps {
  title?: string;
  insights: Insight[];
}

const dotColor = {
  high: 'bg-critical',
  medium: 'bg-warning',
  low: 'bg-brand',
};

export function AIInsightPanel({ title = 'AI Briefing', insights }: AIInsightPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="ui-card p-3.5 sm:p-4"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-canvas border border-border flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-brand-magenta" />
        </div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <ul className="space-y-2">
        {insights.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-2 text-caption text-body"
          >
            <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dotColor[item.priority || 'low']}`} />
            {item.text}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
