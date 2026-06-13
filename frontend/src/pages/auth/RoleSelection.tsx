import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserCircle2, Stethoscope, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { authService, isAuthBypassEnabled } from '../../services';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

function Logo({ size = 18, fill = '#DB2777' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        fill={fill}
        d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
      />
    </svg>
  );
}

const ROLE_ROUTES: Record<User['role'], string> = {
  beneficiary: '/beneficiary',
  asha_worker: '/asha',
  partner: '/partner',
};

export default function RoleSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, fetchInitialData, currentUser } = useStore();
  const { t } = useTranslation();
  const bypass = isAuthBypassEnabled();

  const enterAsRoleDemo = async (role: User['role']) => {
    const { user } = await authService.login(
      { email: 'demo@asha.ai', password: 'demo' },
      { role },
    );
    login(user);
    await fetchInitialData(true);
    navigate(ROLE_ROUTES[role]);
  };

  const selectRole = (role: User['role']) => {
    if (bypass) {
      void enterAsRoleDemo(role);
      return;
    }
    navigate(`/login?role=${role}`);
  };

  useEffect(() => {
    if (currentUser) {
      navigate(ROLE_ROUTES[currentUser.role], { replace: true });
      return;
    }

    const preset = searchParams.get('role');
    if (preset === 'beneficiary' || preset === 'asha_worker' || preset === 'partner') {
      if (bypass) {
        void enterAsRoleDemo(preset);
      } else {
        navigate(`/login?role=${preset}`, { replace: true });
      }
    }
  }, [searchParams, currentUser, navigate, bypass]);

  const roles = [
    {
      key: 'beneficiary' as const,
      icon: <UserCircle2 size={28} />,
      title: t('auth.beneficiary'),
      desc: t('auth.beneficiary_desc'),
      well: 'bg-canvas border border-border text-brand',
      arrow: 'text-brand',
      glow: 'group-hover:shadow-soft',
    },
    {
      key: 'asha_worker' as const,
      icon: <Stethoscope size={28} />,
      title: t('auth.asha'),
      desc: t('auth.asha_desc'),
      well: 'bg-canvas border border-border text-brand-magenta',
      arrow: 'text-brand-magenta',
      glow: 'group-hover:shadow-soft',
    },
    {
      key: 'partner' as const,
      icon: <Building2 size={28} />,
      title: t('auth.partner'),
      desc: t('auth.partner_desc'),
      well: 'bg-canvas border border-border text-ink',
      arrow: 'text-ink',
      glow: 'group-hover:shadow-soft',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink font-sans p-6 flex flex-col items-center justify-center">

      <div className="relative max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-wash mb-6 shadow-soft">
            <Logo size={22} />
          </div>
          <p className="ui-eyebrow mb-3">ASHA AI</p>
          <h1 className="saas-display mb-4">
            {t('auth.who_are_you')}
          </h1>
          <p className="saas-lead max-w-lg mx-auto">
            {bypass
              ? 'Voice-first maternal health for rural India. Pick a role to explore the demo. No login required.'
              : 'Voice-first maternal health for rural India. Choose your role, then sign in or create an account.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r, i) => (
            <motion.button
              key={r.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => selectRole(r.key)}
              className={`saas-surface p-7 text-left h-72 flex flex-col justify-between group saas-hover-lift ${r.glow}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${r.well}`}>
                {r.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight mb-1.5 text-ink">{r.title}</h3>
                <p className="text-caption text-muted">{r.desc}</p>
              </div>
              <div className="flex justify-end">
                <div
                  className={`w-11 h-11 rounded-full bg-canvas border border-border ${r.arrow} flex items-center justify-center translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300`}
                >
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-10 mx-auto block text-faint font-medium hover:text-ink transition-colors duration-300"
        >
          {t('common.back')}
        </button>
      </div>
    </div>
  );
}
