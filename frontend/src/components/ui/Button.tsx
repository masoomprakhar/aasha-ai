import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({ className, variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-button font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-subtle text-ink border border-border hover:bg-brand-wash',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-border bg-canvas hover:bg-subtle text-ink',
    ghost: 'text-muted hover:text-ink hover:bg-subtle',
  };

  const sizes = {
    sm: 'h-9 px-4 text-[13px]',
    md: 'h-10 px-5 text-[14px]',
    lg: 'h-11 px-6 text-[15px]',
    xl: 'h-12 px-8 text-base',
  };

  return (
    <button className={twMerge(base, variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
