import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'accent';
}

export function GlassCard({ children, className, onClick, variant = 'default' }: GlassCardProps) {
  const variants = {
    default: 'ui-card',
    accent: 'bg-brand-wash/50 border border-brand-ring rounded-card shadow-soft',
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(
        variants[variant],
        onClick && 'cursor-pointer hover:border-brand-ring hover:shadow-card transition-all',
        className,
      )}
    >
      {children}
    </div>
  );
}
