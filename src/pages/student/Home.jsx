import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * Antes esta rota (/estudante, pra onde o login redireciona) renderizava um
 * placeholder genérico ("Perfil: student" + botão Sair) em vez do
 * marketplace de verdade — o estudante logava e caía numa tela morta, sem
 * conseguir navegar pro que a gente já tinha construído (Marketplace.jsx).
 * A "home" do estudante É o marketplace, então só redireciona pra lá.
 */
export function Home() {
  return <Navigate to={ROUTES.SELLERS} replace />;
}
