/** ASHA AI design tokens. White canvas, pink/magenta text accents only. */

export type Role = 'beneficiary' | 'asha_worker' | 'partner';

export interface RoleTheme {
  name: string;
  solid: string;
  text: string;
  soft: string;
  softText: string;
  ring: string;
  gradient: string;
  blob: string;
  hex: string;
  label: string;
}

const brand = {
  solid: 'bg-canvas text-brand border border-border hover:border-brand/40 hover:text-brand-dark',
  text: 'text-brand',
  soft: 'bg-brand-wash',
  softText: 'text-brand-dark',
  ring: 'border-border',
  gradient: 'from-gray-50 to-white',
  blob: 'bg-gray-50',
  hex: '#DB2777',
};

export const ROLE_THEME: Record<Role, RoleTheme> = {
  beneficiary: { name: 'pink', ...brand, label: 'Beneficiary' },
  asha_worker: {
    name: 'magenta',
    solid: 'bg-canvas text-brand-magenta border border-border hover:border-brand-magenta/40',
    text: 'text-brand-magenta',
    soft: 'bg-brand-wash',
    softText: 'text-brand-magenta',
    ring: 'border-border',
    gradient: 'from-gray-50 to-white',
    blob: 'bg-gray-50',
    hex: '#C026D3',
    label: 'ASHA Worker',
  },
  partner: {
    name: 'pink',
    solid: 'bg-canvas text-brand border border-border hover:border-brand/40',
    text: 'text-brand',
    soft: 'bg-brand-wash',
    softText: 'text-brand-dark',
    ring: 'border-border',
    gradient: 'from-gray-50 to-white',
    blob: 'bg-gray-50',
    hex: '#DB2777',
    label: 'Partner',
  },
};

export const getTheme = (role: Role): RoleTheme => ROLE_THEME[role];

export const surface = {
  page: 'bg-canvas',
  pill: 'bg-brand-wash',
  card: 'ui-card',
  cardHover: 'hover:border-gray-300 hover:shadow-card transition-all',
};
