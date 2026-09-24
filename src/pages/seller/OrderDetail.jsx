import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import { orderService } from '../../services/api/orderService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { formatCurrency } from '../../utils/formatCurrency';
import './seller.css';

export function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  function load() {
    setLoading(true);
    setNotFound(false);
    orderService
      .getById(orderId)
      .then((data) => setOrder(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }

  useEffect(load, [orderId]);

  return (
    <main className="seller-page">
      <div className="seller-container seller-narrow">
        <header className="seller-page-header">
          <div>
            <Link className="seller-back" to={ROUTES.SELLER_ORDERS}>← Pedidos</Link>
            <span className="seller-eyebrow">Pedido</span>
            <h1>Pedido #{orderId}</h1>
          </div>
        </header>

        {loading && <Loading label="Carregando pedido..." />}

        {!loading && notFound && (
          <ErrorMessage
            title="Este pedido ainda não está disponível."
            description="Esta tela está pronta para mostrar itens, quantidades, total, horário de retirada e status assim que a API de pedidos estiver conectada."
            onRetry={load}
          />
        )}

        {!loading && order && (
          <Card>
            <Badge tone="neutral">{ORDER_STATUS_LABELS[order.status] || order.status}</Badge>
            <div style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)' }}>
              {(order.items ?? []).map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatCurrency(item.unitPriceInCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 'var(--space-4)', fontWeight: 700 }}>
              Total: {formatCurrency(order.totalInCents ?? 0)}
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
