import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="route-loading" aria-live="polite">Carregando...</div>;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to={getRoleHome(role)} replace />;

  return <Outlet />;
}

function getRoleHome(role) {
  if (role === 'seller') return ROUTES.SELLER_HOME;
  if (role === 'admin') return ROUTES.ADMIN_HOME;
  return ROUTES.STUDENT_HOME;
}
