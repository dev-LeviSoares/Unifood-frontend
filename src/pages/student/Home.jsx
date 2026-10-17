import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
export function Home() {
  return <Navigate to={ROUTES.SELLERS} replace />;
}
