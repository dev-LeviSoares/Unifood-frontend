import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/auth.css';
export function Home() {
  return <main className="role-page"><section className="role-card"><div className="auth-brand">UniFood</div><h1>Marketplace de comida</h1><p>Encontre produtos e acesse sua conta.</p><div className="role-actions"><Link className="primary-button" to={ROUTES.LOGIN}>Entrar</Link><Link className="secondary-button" to={ROUTES.REGISTER}>Criar conta</Link></div></section></main>;
}
