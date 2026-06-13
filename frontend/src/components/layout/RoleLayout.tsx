import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Gift, User, Mic, Users, ScanLine,
  AlertCircle, LayoutGrid, FileText, LogOut, Activity, ChevronLeft, Volume2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { LanguageToggle } from '../ui/LanguageToggle';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import VoiceAssistant from '../VoiceAssistant';
import { useTranslation } from '../../hooks/useTranslation';
import { getTheme, type Role } from '../../lib/theme';

interface RoleLayoutProps {
  children: ReactNode;
  role: Role;
  title?: string;
  showBack?: boolean;
  hideHeader?: boolean;
}

/** Brand mark (reference SVG logo). */
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

export function RoleLayout({ children, role, title, hideHeader = false }: RoleLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser, isHydrated } = useStore();
  const { t } = useTranslation();
  const theme = getTheme(role);

  useEffect(() => {
    if (isHydrated && !currentUser) {
      navigate('/role-select');
    }
  }, [currentUser, isHydrated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand animate-pulse-soft" />
        <p className="text-caption text-muted">Loading…</p>
      </div>
    );
  }

  if (!currentUser) return null;

  const isRoot =
    location.pathname === '/beneficiary' ||
    location.pathname === '/asha' ||
    location.pathname === '/partner';

  const showBack = !isRoot;

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={clsx(
          'flex flex-col items-center justify-center w-full py-1.5 transition-all duration-300 relative',
          isActive ? theme.text : 'text-faint',
        )}
      >
        <div className={clsx('p-1.5 rounded-xl transition-all', isActive && theme.soft)}>
          <Icon className={clsx('w-5 h-5', isActive && 'fill-current')} strokeWidth={isActive ? 0 : 2} />
        </div>
        {isActive && (
          <span className="text-[9px] font-bold mt-0.5">{label}</span>
        )}
      </button>
    );
  };

  const MobileNavShell = ({ children: navChildren }: { children: ReactNode }) => (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe pt-1">
      <div className="max-w-md mx-auto ui-card rounded-2xl px-2 py-1 flex justify-between items-center shadow-lift">
        {navChildren}
      </div>
    </div>
  );

  const BeneficiaryNav = () => (
    <MobileNavShell>
      <NavItem icon={Home} label={t('nav.home')} path="/beneficiary" />
      <NavItem icon={Activity} label={t('nav.tracker')} path="/beneficiary/tracker" />
      <div className="relative -top-4">
        <VoiceAssistant customTrigger={(onClick, isSpeaking) => (
          <button
            onClick={onClick}
            className={clsx(
              'w-[52px] h-[52px] rounded-full shadow-xl flex items-center justify-center bg-canvas border border-border hover:scale-105 transition-transform',
              isSpeaking ? 'text-brand-magenta animate-pulse' : 'text-brand',
            )}
          >
            {isSpeaking ? <Volume2 className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        )} />
      </div>
      <NavItem icon={Gift} label={t('nav.schemes')} path="/beneficiary/schemes" />
      <NavItem icon={User} label={t('nav.profile')} path="/beneficiary/card" />
    </MobileNavShell>
  );

  const AshaNav = () => (
    <MobileNavShell>
      <NavItem icon={Home} label={t('nav.dashboard')} path="/asha" />
      <NavItem icon={Users} label={t('nav.patients')} path="/asha/patients" />
      <div className="relative -top-4">
        <button
          onClick={() => navigate('/asha/visit')}
          className="w-[52px] h-[52px] rounded-full bg-canvas border border-border shadow-lift flex items-center justify-center text-brand-magenta hover:scale-105 transition-transform"
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>
      <NavItem icon={ScanLine} label={t('nav.scan')} path="/asha/scan" />
      <NavItem icon={AlertCircle} label={t('nav.alerts')} path="/asha/alerts" />
    </MobileNavShell>
  );

  const PartnerSidebar = () => (
    <div className="hidden md:flex flex-col w-72 fixed inset-y-0 left-0 bg-white border-r border-black/5 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#EDEDED]">
          <Logo size={20} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">ASHA AI</h1>
      </div>

      <div className="flex-1 px-6 space-y-2 mt-2">
        <button
          onClick={() => navigate('/partner')}
          className={clsx(
            'w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-semibold',
            location.pathname === '/partner' ? clsx(theme.solid, 'shadow-lg shadow-brand-ring') : 'text-gray-500 hover:bg-brand-wash',
          )}
        >
          <LayoutGrid size={20} /> {t('nav.dashboard')}
        </button>
        <button
          onClick={() => navigate('/partner/schemes')}
          className={clsx(
            'w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-semibold',
            location.pathname.includes('schemes') ? clsx(theme.solid, 'shadow-lg shadow-brand-ring') : 'text-gray-500 hover:bg-brand-wash',
          )}
        >
          <FileText size={20} /> {t('nav.schemes')}
        </button>
      </div>

      <div className="p-6 border-t border-black/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-semibold"
        >
          <LogOut size={20} /> {t('common.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-[4.5rem] md:pb-0 bg-canvas text-body font-sans">
      {!hideHeader && (
        <div className="sticky top-0 z-30 px-4 sm:px-5 py-3 bg-canvas/90 backdrop-blur-md border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-subtle text-muted hover:text-ink transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
            ) : (
              <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center font-bold', theme.soft, theme.softText)}>
                {currentUser?.name?.[0] || 'A'}
              </div>
            )}
            <h1 className="font-semibold text-lg sm:text-xl text-ink truncate max-w-[200px] tracking-tight">
              {title || 'ASHA AI'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-subtle text-faint hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      )}

      <div className={clsx('md:min-h-screen', role === 'partner' && 'md:pl-72')}>
        {role === 'partner' && <PartnerSidebar />}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={clsx('max-w-3xl mx-auto md:max-w-none', !hideHeader && 'px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5')}
        >
          {children}
        </motion.div>
      </div>

      {role === 'beneficiary' && <BeneficiaryNav />}
      {role === 'asha_worker' && <AshaNav />}
    </div>
  );
}
