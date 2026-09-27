import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import '../styles/admin-layout.css';

export function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="admin-app-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>U</span><div><strong>UNIFOOD</strong><small>Administração</small></div></div>
        <div className="admin-sidebar-label">Visão da plataforma</div>
        <nav aria-label="Navegação administrativa">
          <NavLink to={ROUTES.ADMIN_HOME} end><Icon name="dashboard" />Visão geral</NavLink>
          <span className="admin-nav-disabled"><Icon name="users" />Usuários</span>
          <span className="admin-nav-disabled"><Icon name="store" />Vendedores</span>
          <span className="admin-nav-disabled"><Icon name="box" />Produtos</span>
          <span className="admin-nav-disabled"><Icon name="orders" />Pedidos</span>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user"><span>{(user?.name || 'A').charAt(0).toUpperCase()}</span><div><strong>{user?.name || 'Administrador'}</strong><small>acesso administrativo</small></div></div>
          <button type="button" onClick={logout}><Icon name="logout" /> Sair</button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-mobile-header"><div><strong>UNIFOOD</strong><span>Administração</span></div><div className="admin-mobile-avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</div></header>
        <Outlet />
      </div>
    </div>
  );
}

function Icon({ name }) {
  const paths = {
    dashboard: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M15 5.5a3 3 0 0 1 0 5.8M16.5 15a5 5 0 0 1 4 5"/></>,
    store: <><path d="M4 10h16v10H4z"/><path d="m3 10 2-6h14l2 6"/><path d="M8 10v3M12 10v3M16 10v3"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    orders: <><path d="M5 4h14v16H5z"/><path d="m8 12 2.5 2.5L16 9"/></>,
    logout: <><path d="M10 5H5v14h5"/><path d="m14 8 4 4-4 4"/><path d="M9 12h9"/></>,
  };
  return <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
