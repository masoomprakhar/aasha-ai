import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useToast } from '../../store/useToast';
import { authService } from '../../services';
import { User as UserType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as UserType['role'] || 'beneficiary';
  const { login, currentUser, fetchInitialData, ensureBeneficiaryProfile, resetSession } = useStore();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'beneficiary') navigate('/beneficiary');
      else if (currentUser.role === 'asha_worker') navigate('/asha');
      else navigate('/partner');
    }
  }, [currentUser, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const { user } = await authService.login(
          { email: formData.email, password: formData.password },
          { role },
        );

        login(user as UserType);
        await fetchInitialData();

        addToast(t('common.success'), 'success');

        if (user.role === 'beneficiary') navigate('/beneficiary');
        else if (user.role === 'asha_worker') navigate('/asha');
        else navigate('/partner');

      } else {
        const user = await authService.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          role: role,
        });

        login(user as UserType);

        if (user.role === 'beneficiary') {
          await ensureBeneficiaryProfile(user.id, formData.name);
        }

        await fetchInitialData();

        addToast(t('common.success'), 'success');

        if (user.role === 'beneficiary') navigate('/beneficiary');
        else if (user.role === 'asha_worker') navigate('/asha');
        else navigate('/partner');
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      const message = error.response?.data?.detail || error.message || t('common.error');
      addToast(message, 'error');
      if (authService.isAuthenticated()) {
        await authService.logout();
        resetSession();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabels = {
    beneficiary: { title: t('auth.beneficiary'), color: 'btn-brand', text: 'text-brand', light: 'text-brand bg-canvas border border-border', ring: 'focus:border-brand/40 focus:ring-gray-100' },
    asha_worker: { title: t('auth.asha'), color: 'btn-brand', text: 'text-brand-magenta', light: 'text-brand-magenta bg-canvas border border-border', ring: 'focus:border-brand-magenta/40 focus:ring-gray-100' },
    partner: { title: t('auth.partner'), color: 'btn-brand', text: 'text-brand', light: 'text-brand bg-canvas border border-border', ring: 'focus:border-brand/40 focus:ring-gray-100' }
  };

  const currentRole = roleLabels[role];
  const inputClass = `w-full pl-12 pr-4 py-3.5 rounded-2xl bg-canvas border border-black/5 focus:bg-white focus:ring-4 focus:outline-none font-medium text-gray-900 transition-all placeholder:text-gray-400 ${currentRole.ring}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas flex items-center justify-center p-6 font-sans">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md saas-surface rounded-3xl p-8 sm:p-10"
      >
        <button
          onClick={() => navigate('/role-select')}
          className="flex items-center text-gray-400 font-medium mb-8 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" /> {t('common.back')}
        </button>

        <div className="mb-7">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentRole.light} mb-3 inline-block`}>
            {isLoginMode ? t('auth.welcome_back') : t('auth.create_account')}
          </span>
          <h1 className="saas-headline text-ink">{currentRole.title}</h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-3.5">

          {!isLoginMode && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                placeholder={t('auth.fullname')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              placeholder={t('auth.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              placeholder={t('auth.password')}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${currentRole.color} mt-5 group`}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                {isLoginMode ? t('auth.login') : t('auth.signup')}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-gray-500 font-medium hover:text-gray-900 transition-colors text-sm"
          >
            {isLoginMode ? t('auth.dont_have_account') : t('auth.already_have_account')}
            <span className={`font-semibold underline ${currentRole.text} ml-1`}>
              {isLoginMode ? t('auth.signup') : t('auth.login')}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
