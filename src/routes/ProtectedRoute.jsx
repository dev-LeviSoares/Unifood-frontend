import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

/**
 * DEV_MODE is intentionally gated by Vite's own development flag.
 * This prevents VITE_DEV_MODE=true from becoming an authentication bypass
 * in a production build.
 */
const isDevMode = import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (isDevMode) {
    return <Outlet />;
  }

  if (loading) return <div className="route-loading" aria-live="polite">Carregando...</div>;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to={getRoleHome(role)} replace />;

  return <Outlet />;
}

function getRoleHome(role) {
  if (role === ROLES.SELLER) return ROUTES.SELLER_HOME;
  if (role === ROLES.ADMIN) return ROUTES.ADMIN_HOME;
  return ROUTES.STUDENT_HOME;
}
