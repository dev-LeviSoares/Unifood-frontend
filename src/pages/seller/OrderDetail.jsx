import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function OrderDetail() {
  const { orderId } = useParams();
  return <main className="seller-page"><div className="seller-container seller-narrow">
    <header className="seller-page-header"><div><Link className="seller-back" to={ROUTES.SELLER_ORDERS}>← Pedidos</Link><span className="seller-eyebrow">Pedido</span><h1>Pedido #{orderId}</h1><p>Os dados completos do pedido serão carregados pela API.</p></div></header>
    <section className="seller-panel seller-empty-panel"><div className="seller-empty-icon">#</div><h2>Pedido ainda não disponível</h2><p>Esta tela está preparada para mostrar itens, quantidades, total, horário de retirada e status do pedido.</p></section>
  </div></main>;
}
