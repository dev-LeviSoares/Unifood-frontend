import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import "../styles/seller-layout.css";

const links = [
  ['Visão geral', ROUTES.SELLER_HOME, '⌂'],
  ['Produtos', ROUTES.SELLER_PRODUCTS, '□'],
  ['Cardápios', ROUTES.SELLER_MENUS, '☰'],
  ['Pedidos', ROUTES.SELLER_ORDERS, '✓'],
  ['Histórico', ROUTES.SELLER_HISTORY, '↺'],
  ['Meu perfil', ROUTES.SELLER_PROFILE, '○'],
];

export function SellerLayout() {
  const { user, logout } = useAuth();
  return <div className="seller-app-shell">
    <aside className="seller-sidebar">
      <div className="seller-sidebar-brand"><span>UF</span><div><strong>Unifood</strong><small>Área do vendedor</small></div></div>
      <nav aria-label="Navegação do vendedor">{links.map(([label, to, icon]) => <NavLink key={to} to={to} end={to === ROUTES.SELLER_HOME} className={({ isActive }) => isActive ? 'active' : ''}><span>{icon}</span>{label}</NavLink>)}</nav>
      <div className="seller-sidebar-footer"><div className="seller-sidebar-user"><div className="seller-mini-avatar">{(user?.name || 'V').charAt(0).toUpperCase()}</div><div><strong>{user?.establishmentName || user?.name || 'Vendedor'}</strong><span>@{user?.username || 'vendedor'}</span></div></div><button onClick={logout}>Sair</button></div>
    </aside>
    <div className="seller-content"><header className="seller-mobile-header"><div><strong>Unifood</strong><span>Área do vendedor</span></div><div className="seller-mobile-avatar">{(user?.name || 'V').charAt(0).toUpperCase()}</div></header><Outlet /></div>
  </div>;
}
