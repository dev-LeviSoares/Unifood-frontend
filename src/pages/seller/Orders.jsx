import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/api/orderService';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import './seller.css';

// Antes essas abas eram só <span> sem onClick — clicar nelas não fazia
// nada. Agora filtram de verdade a lista (mesmo hoje vazia) e usam os
// mesmos rótulos de ORDER_STATUS_LABELS usados no resto do app, em vez de
// um texto solto reescrito só aqui.
const tabs = [
  { key: 'all', label: 'Todos' },
  { key: ORDER_STATUS.PENDING, label: ORDER_STATUS_LABELS[ORDER_STATUS.PENDING] },
  { key: ORDER_STATUS.PREPARING, label: ORDER_STATUS_LABELS[ORDER_STATUS.PREPARING] },
  { key: ORDER_STATUS.READY, label: ORDER_STATUS_LABELS[ORDER_STATUS.READY] },
];

export function Orders() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    orderService
      .listBySeller(user?.id, activeTab === 'all' ? undefined : { status: activeTab })
      .then((data) => { if (active) setOrders(data ?? []); })
      .catch(() => { if (active) setOrders([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.id, activeTab]);

  return (
    <main className="seller-page">
      <div className="seller-container">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Operação</span>
            <h1>Pedidos</h1>
            <p>Organize os pedidos para retirada e avance cada etapa da preparação.</p>
          </div>
        </header>

        <div className="seller-order-tabs" role="tablist" aria-label="Filtrar pedidos por status">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`seller-order-tab ${activeTab === tab.key ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <Loading label="Carregando pedidos..." />}

        {!loading && orders.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: 'var(--space-7) var(--space-4)' }}>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Nenhum pedido por enquanto</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
                Quando estudantes fizerem pedidos, eles aparecerão aqui para você acompanhar até a retirada.
              </p>
              <Link className="ui-button ui-button--secondary" to={ROUTES.SELLER_HISTORY}>
                Ver histórico
              </Link>
            </div>
          </Card>
        )}

        {!loading && orders.length > 0 && (
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {orders.map((order) => (
              <Link key={order.id} to={ROUTES.SELLER_ORDER_DETAIL.replace(':orderId', order.id)}>
                <Card>
                  <strong>Pedido #{order.id}</strong>
                  <p className="seller-muted">{ORDER_STATUS_LABELS[order.status] || order.status}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
