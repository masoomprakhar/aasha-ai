import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { authService, isAuthBypassEnabled } from '../../services';
import { useStore } from '../../store/useStore';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

const ROLE_HOME: Record<Role, string> = {
  beneficiary: '/beneficiary',
  asha_worker: '/asha',
  partner: '/partner',
};

const ROLE_PREFIXES: Array<{ prefix: string; role: Role }> = [
  { prefix: '/beneficiary', role: 'beneficiary' },
  { prefix: '/asha', role: 'asha_worker' },
  { prefix: '/partner', role: 'partner' },
];

function resolveRequiredRole(pathname: string, roles?: Role[]): Role | null {
  if (roles?.length === 1) return roles[0];
  const match = ROLE_PREFIXES.find(({ prefix }) => pathname.startsWith(prefix));
  return match?.role ?? null;
}

function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-subtle">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand animate-pulse-soft" />
        <p className="text-[13px] text-muted font-medium">Loading ASHA AI…</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { currentUser, login, fetchInitialData } = useStore();
  const [bypassReady, setBypassReady] = useState(false);
  const requiredRole = resolveRequiredRole(location.pathname, roles);

  useEffect(() => {
    if (!isAuthBypassEnabled()) return;

    const role = requiredRole ?? 'beneficiary';
    let active = true;

    const setup = async () => {
      if (currentUser?.role === role && authService.isAuthenticated()) {
        if (active) setBypassReady(true);
        return;
      }

      const { user } = await authService.login(
        { email: 'demo@asha.ai', password: 'demo' },
        { role },
      );
      if (!active) return;
      login(user);
      await fetchInitialData(true);
      if (active) setBypassReady(true);
    };

    setBypassReady(false);
    void setup();

    return () => {
      active = false;
    };
  }, [requiredRole, currentUser?.role, login, fetchInitialData]);

  if (isAuthBypassEnabled()) {
    if (!bypassReady) return <RouteLoader />;
    return <>{children}</>;
  }

  if (!authService.isAuthenticated()) {
    return <Navigate to="/role-select" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && currentUser && currentUser.role !== requiredRole) {
    return <Navigate to={ROLE_HOME[currentUser.role]} replace />;
  }

  return <>{children}</>;
}
