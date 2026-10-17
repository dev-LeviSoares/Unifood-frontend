import { readLocalData } from '../../../services/storage/localData';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../contexts/CartContext';
import { Icon } from '../../../components/marketplace/Icon';
import { SearchField } from '../../../components/marketplace/SearchField';

export function MarketplaceHeader({ title }) {
  const { user, role, isAuthenticated } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const showTitle = title && location.pathname !== ROUTES.HOME;
  const query = new URLSearchParams(location.search).get('q') || '';
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const account = !isAuthenticated
    ? ROUTES.LOGIN
    : role === 'seller'
      ? ROUTES.SELLER_HOME
      : role === 'admin'
        ? ROUTES.ADMIN_HOME
        : ROUTES.STUDENT_PROFILE;
  const profile = user ? readLocalData(`unifood_profile:${user.id}`, {}) : {};
  const initials = (profile.name || user?.name || 'Minha conta')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  const links = [
    { to: ROUTES.HOME, label: 'Início', icon: 'home', end: true },
    { to: ROUTES.SELLERS, label: 'Buscar', icon: 'search' },
    { to: ROUTES.STUDENT_ORDERS, label: 'Pedidos', icon: 'receipt' },
    { to: ROUTES.CART, label: 'Carrinho', icon: 'bag' },
    { to: account, label: 'Perfil', icon: 'user' },
  ];
  const search = (value) =>
    navigate(
      `${ROUTES.SELLERS}${value.trim() ? `?q=${encodeURIComponent(value.trim())}` : ''}`,
    );
  return (
    <>
      <header className="uf-header">
        <div className="uf-header-inner">
          <Link
            className="uf-brand"
            to={ROUTES.HOME}
            aria-label="Ir para o início do Unifood"
          >
            <img
              src="/images/categories/unifood-logo.webp"
              alt="Unifood"
              className="unifood-logo"
            />
            <span>UNIFOOD</span>
          </Link>
          {showTitle && <span className="uf-mobile-title">{title}</span>}
          <div className="uf-header-search">
            <SearchField key={query} value={query} onSearch={search} />
          </div>
          <nav className="uf-desktop-nav" aria-label="Navegação principal">
            <NavLink end to={ROUTES.HOME}>
              Início
            </NavLink>
            <NavLink to={ROUTES.STUDENT_ORDERS}>Pedidos</NavLink>
          </nav>
          <Link
            className="uf-header-cart"
            to={ROUTES.CART}
            aria-label={`Carrinho com ${count} itens`}
          >
            <Icon name="bag" />
            {count > 0 && <b>{count}</b>}
          </Link>
          <Link
            className="uf-avatar"
            to={account}
            aria-label={isAuthenticated ? 'Minha conta' : 'Entrar'}
          >
            {isAuthenticated ? initials : <Icon name="user" size={18} />}
          </Link>
        </div>
      </header>
      <nav className="uf-bottom-nav" aria-label="Navegação mobile">
        {links.map((link) => (
          <NavLink key={link.label} to={link.to} end={link.end}>
            <Icon name={link.icon} />
            <span>{link.label}</span>
            {link.icon === 'bag' && count > 0 && <b>{count}</b>}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
