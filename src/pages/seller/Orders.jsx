import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function Orders() {
  return <main className="seller-page"><div className="seller-container">
    <header className="seller-page-header"><div><span className="seller-eyebrow">Operação</span><h1>Pedidos</h1><p>Organize os pedidos para retirada e avance cada etapa da preparação.</p></div></header>
    <div className="seller-order-tabs"><span className="active">Todos</span><span>Pendentes</span><span>Em preparação</span><span>Prontos</span></div>
    <section className="seller-panel seller-empty-panel"><div className="seller-empty-icon">✓</div><h2>Nenhum pedido por enquanto</h2><p>Quando estudantes fizerem pedidos, eles aparecerão aqui para você acompanhar até a retirada.</p><Link className="seller-secondary-button" to={ROUTES.SELLER_HISTORY}>Ver histórico</Link></section>
  </div></main>;
}
