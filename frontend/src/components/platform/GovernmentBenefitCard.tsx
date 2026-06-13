import { ArrowUpRight, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface GovernmentBenefitCardProps {
  title: string;
  description?: string;
  status?: string;
  image?: string;
  onClick?: () => void;
  compact?: boolean;
}

export function GovernmentBenefitCard({
  title,
  description,
  status = 'Active',
  image,
  onClick,
  compact,
}: GovernmentBenefitCardProps) {
  if (compact) {
    return (
      <motion.button
        type="button"
        whileHover={onClick ? { y: -2 } : undefined}
        onClick={onClick}
        className={`ui-card min-w-[160px] p-2.5 text-left shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      >
        {image ? (
          <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover mb-2" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-brand-wash flex items-center justify-center mb-2">
            <Gift className="w-5 h-5 text-brand" />
          </div>
        )}
        <h4 className="text-sm font-semibold text-ink truncate">{title}</h4>
        {description && <p className="text-[11px] text-muted truncate">{description}</p>}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : undefined}
      onClick={onClick}
      className={`ui-card overflow-hidden flex gap-4 p-4 ${onClick ? 'cursor-pointer group' : ''}`}
    >
      {image ? (
        <img src={image} alt="" className="w-16 h-16 rounded-card object-cover shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-card bg-brand-wash flex items-center justify-center shrink-0">
          <Gift className="w-7 h-7 text-brand" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[15px] font-semibold text-ink truncate">{title}</h4>
          {onClick && <ArrowUpRight className="w-4 h-4 text-faint group-hover:text-brand shrink-0" />}
        </div>
        {description && <p className="text-[13px] text-muted line-clamp-2 mt-1">{description}</p>}
        <span className="inline-block mt-2 text-[11px] font-medium text-brand bg-brand-wash px-2 py-0.5 rounded-pill">
          {status}
        </span>
      </div>
    </motion.div>
  );
}
