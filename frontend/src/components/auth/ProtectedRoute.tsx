import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { authService } from '../../services';
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

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { currentUser } = useStore();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/role-select" replace state={{ from: location.pathname }} />;
  }

  const requiredRole = resolveRequiredRole(location.pathname, roles);

  if (requiredRole && currentUser && currentUser.role !== requiredRole) {
    return <Navigate to={ROLE_HOME[currentUser.role]} replace />;
  }

  return <>{children}</>;
}
