import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function SectionHeader({ eyebrow, title, description, action, compact }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2',
        compact ? 'mb-3' : 'mb-4',
      )}
    >
      <div>
        {eyebrow && <p className={clsx('ui-eyebrow', compact ? 'mb-1' : 'mb-2')}>{eyebrow}</p>}
        <h2 className={clsx('font-semibold text-ink tracking-tight', compact ? 'text-base' : 'saas-headline text-xl sm:text-2xl')}>{title}</h2>
        {description && <p className={clsx('text-muted', compact ? 'text-caption mt-0.5' : 'text-body mt-1 max-w-xl')}>{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
