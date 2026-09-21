import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/auth.css';

export function RoleHome({ title, user, logout }) {
  return (
    <main className="role-page">
      <section className="role-card">
        <div className="auth-brand">UniFood</div>
        <p className="auth-eyebrow">Acesso protegido</p>
        <h1>{title}</h1>
        <p>Olá, {user?.name || user?.username || 'usuário'}.</p>
        <p className="role-badge">Perfil: {user?.role}</p>
        <div className="role-actions">
          <button className="primary-button" onClick={logout}>Sair</button>
          <Link className="secondary-button" to={ROUTES.HOME}>Página inicial</Link>
        </div>
      </section>
    </main>
  );
}
