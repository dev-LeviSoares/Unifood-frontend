import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function Menus() {
  return <main className="seller-page"><div className="seller-container">
    <header className="seller-page-header"><div><span className="seller-eyebrow">Oferta do dia</span><h1>Cardápios</h1><p>Defina quais produtos estarão disponíveis em cada período.</p></div><Link className="seller-primary-button" to={ROUTES.SELLER_MENU_NEW}>Novo cardápio</Link></header>
    <section className="seller-panel seller-empty-panel"><div className="seller-empty-icon">☰</div><h2>Nenhum cardápio criado</h2><p>Monte seu primeiro cardápio e deixe claro para o estudante o que ele pode pedir antes de chegar ao campus.</p><Link className="seller-primary-button" to={ROUTES.SELLER_MENU_NEW}>Criar cardápio</Link></section>
  </div></main>;
}
