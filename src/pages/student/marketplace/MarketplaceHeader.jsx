import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useCart } from '../../../contexts/CartContext';
import './marketplace.css';

export function MarketplaceHeader() {
  const location = useLocation();
  const { items } = useCart();

  return (
    <header className="marketplace-header">
      <div className="marketplace-header__inner">
        <Link to={ROUTES.HOME} className="marketplace-brand" aria-label="Ir para o início do Unifood">
          <span className="marketplace-brand__mark">U</span>
          <span>Unifood</span>
        </Link>

        <nav className="marketplace-nav" aria-label="Navegação principal">
          <Link className={location.pathname.startsWith(ROUTES.SELLERS) || location.pathname.startsWith(ROUTES.PRODUCT) ? 'is-active' : ''} to={ROUTES.SELLERS}>
            Explorar
          </Link>
          <Link to={ROUTES.HOME}>Início</Link>
        </nav>

        <Link className="marketplace-cart" to={ROUTES.CART} aria-label={`Carrinho com ${items.length} itens`}>
          <span aria-hidden="true">🛒</span>
          {items.length > 0 && <span className="marketplace-cart__count">{items.length}</span>}
        </Link>
      </div>
    </header>
  );
}
