import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import '../styles/seller-layout.css';

const links = [
  ['Visão geral', ROUTES.SELLER_HOME, 'home'],
  ['Produtos', ROUTES.SELLER_PRODUCTS, 'box'],
  ['Cardápios', ROUTES.SELLER_MENUS, 'menu'],
  ['Pedidos', ROUTES.SELLER_ORDERS, 'orders'],
  ['Histórico', ROUTES.SELLER_HISTORY, 'history'],
  ['Meu perfil', ROUTES.SELLER_PROFILE, 'user'],
];

export function SellerLayout() {
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'vendedor';
  return (
    <div className="seller-app-shell">
      <aside className="seller-sidebar">
        <div className="seller-sidebar-brand">
          <span>U</span>
          <div><strong>UNIFOOD</strong><small>Área do vendedor</small></div>
        </div>
        <div className="seller-sidebar-section-label">Operação</div>
        <nav aria-label="Navegação do vendedor">
          {links.map(([label, to, icon]) => (
            <NavLink key={to} to={to} end={to === ROUTES.SELLER_HOME} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="seller-sidebar-footer">
          <div className="seller-sidebar-user">
            <div className="seller-mini-avatar">{(user?.name || 'V').charAt(0).toUpperCase()}</div>
            <div><strong>{user?.establishmentName || user?.name || 'Vendedor'}</strong><span>@{user?.username || 'vendedor'}</span></div>
          </div>
          <button onClick={logout}><Icon name="logout" /> Sair</button>
        </div>
      </aside>
      <div className="seller-content">
        <header className="seller-mobile-header">
          <div><strong>Olá, {firstName}</strong><span>Área do vendedor</span></div>
          <div className="seller-mobile-avatar">{(user?.name || 'V').charAt(0).toUpperCase()}</div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}

function Icon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    orders: <><path d="M5 4h14v16H5z"/><path d="m8 12 2.5 2.5L16 9"/></>,
    history: <><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 5v5h5"/><path d="M12 8v4l3 2"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
    logout: <><path d="M10 5H5v14h5"/><path d="m14 8 4 4-4 4"/><path d="M9 12h9"/></>,
  };
  return <svg className="seller-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
