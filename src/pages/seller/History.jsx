import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function History() {
  return <main className="seller-page"><div className="seller-container">
    <header className="seller-page-header"><div><span className="seller-eyebrow">Vendas</span><h1>Histórico</h1><p>Consulte os pedidos concluídos e acompanhe o histórico da sua operação.</p></div></header>
    <section className="seller-panel seller-empty-panel"><div className="seller-empty-icon">↺</div><h2>Nenhuma venda concluída</h2><p>As vendas concluídas aparecerão aqui depois que os primeiros pedidos forem retirados.</p><Link className="seller-secondary-button" to={ROUTES.SELLER_ORDERS}>Ir para pedidos</Link></section>
  </div></main>;
}
