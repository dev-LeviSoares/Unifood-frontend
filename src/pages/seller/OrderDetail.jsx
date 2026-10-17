import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
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
  const [params] = useSearchParams();
  const fromHistory = params.get('origem') === 'historico';
  const backTo = fromHistory ? ROUTES.SELLER_HISTORY : `${ROUTES.SELLER_ORDERS}?status=${encodeURIComponent(params.get('status') || 'all')}`;
  const [attempt, setAttempt] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = () => setAttempt((value) => value + 1);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    orderService.getById(orderId).then((data) => {
      if (!data || typeof data !== 'object' || String(data.id) !== orderId || !Array.isArray(data.items)) throw new Error('Pedido inválido.');
      if (active) setOrder(data);
    }).catch(() => { if (active) setNotFound(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId, attempt]);

  return (
    <main className="seller-page">
      <div className="seller-container seller-narrow">
        <header className="seller-page-header">
          <div>
            <Link className="seller-back" to={backTo}>← {fromHistory ? 'Histórico' : 'Pedidos'}</Link>
            <span className="seller-eyebrow">Pedido</span>
            <h1>Pedido #{orderId}</h1>
          </div>
        </header>

        {loading && <Loading label="Carregando pedido..." />}

        {!loading && notFound && (
          <ErrorMessage
            title="Este pedido ainda não está disponível."
            description="O endereço pode estar incorreto ou o serviço está indisponível. Tente novamente ou retorne à lista."
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
