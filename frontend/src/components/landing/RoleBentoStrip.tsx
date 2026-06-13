import { ArrowRight, Building2, Stethoscope, UserCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService, isAuthBypassEnabled } from '../../services';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';
import { Reveal } from './Reveal';

const ROLE_ROUTES: Record<User['role'], string> = {
  beneficiary: '/beneficiary',
  asha_worker: '/asha',
  partner: '/partner',
};

interface RoleCard {
  key: User['role'];
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  iconWell: string;
  span: string;
}

const ROLES: RoleCard[] = [
  {
    key: 'beneficiary',
    label: 'Beneficiary',
    title: 'Women & girls',
    description: 'Voice health companion, cycle tracking, schemes, and SOS.',
    icon: UserCircle2,
    accent: 'text-brand',
    iconWell: 'bg-brand-wash text-brand',
    span: 'md:col-span-4',
  },
  {
    key: 'asha_worker',
    label: 'ASHA Worker',
    title: 'Community health',
    description: 'Log visits by voice, scan QR cards, and manage patient alerts.',
    icon: Stethoscope,
    accent: 'text-brand-magenta',
    iconWell: 'bg-brand-magenta/10 text-brand-magenta',
    span: 'md:col-span-4',
  },
  {
    key: 'partner',
    label: 'NGO',
    title: 'Partner programs',
    description: 'Launch schemes, track enrollments, and measure village impact.',
    icon: Building2,
    accent: 'text-ink',
    iconWell: 'bg-subtle text-ink',
    span: 'md:col-span-4',
  },
];

export function RoleBentoStrip() {
  const navigate = useNavigate();
  const { login, fetchInitialData } = useStore();
  const bypass = isAuthBypassEnabled();

  const enterAsRole = async (role: User['role']) => {
    if (bypass) {
      const { user } = await authService.login(
        { email: 'demo@asha.ai', password: 'demo' },
        { role },
      );
      login(user);
      await fetchInitialData(true);
      navigate(ROLE_ROUTES[role]);
      return;
    }
    navigate(`/login?role=${role}`);
  };

  return (
    <section
      className="border-t border-border bg-canvas"
      aria-labelledby="role-bento-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
        <Reveal className="mb-6 sm:mb-7">
          <p className="ui-eyebrow mb-2">Get started</p>
          <h2 id="role-bento-heading" className="text-xl sm:text-2xl font-semibold tracking-tight text-ink">
            Choose how you&apos;ll use ASHA AI
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {ROLES.map((role, i) => {
            const Icon = role.icon;
            return (
              <Reveal key={role.key} delay={0.06 + i * 0.05} className={role.span}>
                <motion.button
                  type="button"
                  onClick={() => void enterAsRole(role.key)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="group w-full h-full min-h-[148px] saas-surface p-5 sm:p-6 text-left flex flex-col justify-between saas-hover-lift"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${role.iconWell}`}>
                      <Icon size={24} strokeWidth={1.75} />
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${role.accent}`}>
                      {role.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold tracking-tight text-ink mb-1">
                      {role.title}
                    </h3>
                    <p className="text-caption text-muted leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <span
                      className={`inline-flex items-center gap-1.5 text-caption font-medium ${role.accent} translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300`}
                    >
                      Enter demo
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </span>
                  </div>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
