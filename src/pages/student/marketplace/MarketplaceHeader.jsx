import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useCart } from '../../../contexts/CartContext';
import './marketplace.css';

export function MarketplaceHeader() {
  const location = useLocation();
  const { items } = useCart();
  const isExplore = location.pathname.startsWith(ROUTES.SELLERS) || location.pathname.startsWith(ROUTES.PRODUCT);

  return (
    <>
      <header className="marketplace-header">
        <div className="marketplace-header__inner">
          <Link to={ROUTES.HOME} className="marketplace-brand" aria-label="Ir para o início do Unifood">
            <span className="marketplace-brand__mark">U</span>
            <span>UNIFOOD</span>
          </Link>

          <nav className="marketplace-nav" aria-label="Navegação principal">
            <Link className={!isExplore ? 'is-active' : ''} to={ROUTES.HOME}><Icon name="home" />Início</Link>
            <Link className={isExplore ? 'is-active' : ''} to={ROUTES.SELLERS}><Icon name="search" />Explorar</Link>
          </nav>

          <Link className="marketplace-cart" to={ROUTES.CART} aria-label={`Carrinho com ${items.length} itens`}>
            <Icon name="bag" />
            {items.length > 0 && <span className="marketplace-cart__count">{items.length}</span>}
          </Link>
        </div>
      </header>
      {/* Fora do <header> de propósito: o header tem backdrop-filter, que cria um
          novo containing block pra descendentes com position:fixed — isso fazia
          essa barra ficar "grudada" perto do topo em vez de ir pro fundo real da
          tela. Como irmã do header (não filha), ela fica fixa relativa à viewport
          de verdade. */}
      <nav className="marketplace-bottom-nav" aria-label="Navegação mobile">
        <Link className={!isExplore ? 'is-active' : ''} to={ROUTES.HOME}><Icon name="home" /><span>Início</span></Link>
        <Link className={isExplore ? 'is-active' : ''} to={ROUTES.SELLERS}><Icon name="search" /><span>Explorar</span></Link>
        <Link className={location.pathname === ROUTES.CART ? 'is-active' : ''} to={ROUTES.CART}><Icon name="bag" /><span>Carrinho</span>{items.length > 0 && <b>{items.length}</b>}</Link>
        <Link to={ROUTES.LOGIN}><Icon name="user" /><span>Entrar</span></Link>
      </nav>
    </>
  );
}

function Icon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bag: <><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
  };
  return <svg className="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
