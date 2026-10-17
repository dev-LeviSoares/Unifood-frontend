import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import { orderService } from '../../services/api/orderService';
import { useSellerList } from '../../hooks/useSellerList';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { formatCurrency } from '../../utils/formatCurrency';
import './seller.css';

export function History() {
  const { items, loading, error, retry } = useSellerList(orderService.listBySeller, 'orders');
  const orders = items.filter((order) => ['completed', 'cancelled'].includes(order.status));

  return (
    <main className="seller-page">
      <div className="seller-container">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Vendas</span>
            <h1>Histórico</h1>
            <p>Consulte os pedidos concluídos e cancelados da sua operação.</p>
          </div>
          <Link className="ui-button ui-button--secondary" to={ROUTES.SELLER_ORDERS}>
            Ir para pedidos
          </Link>
        </header>

        {loading && <Loading label="Carregando histórico..." />}
        {!loading && error && (
          <ErrorMessage
            title="Não foi possível carregar o histórico."
            description="Confira a conexão com o serviço e tente novamente."
            onRetry={retry}
          />
        )}
        {!loading && !error && !orders.length && (
          <Card>
            <div className="operations-empty">
              <h2>Nenhuma venda finalizada</h2>
              <p>Os pedidos concluídos ou cancelados aparecerão aqui.</p>
              <Link className="ui-button ui-button--secondary" to={ROUTES.SELLER_ORDERS}>
                Ver pedidos em andamento
              </Link>
            </div>
          </Card>
        )}
        {!loading && !error && (
          <div className="seller-order-list">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`${ROUTES.SELLER_ORDER_DETAIL.replace(':orderId', encodeURIComponent(order.id))}?origem=historico`}
              >
                <Card>
                  <div>
                    <strong>Pedido #{order.id}</strong>
                    <p className="seller-muted">{ORDER_STATUS_LABELS[order.status]}</p>
                  </div>
                  <strong>{formatCurrency(order.totalInCents ?? 0)} →</strong>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
