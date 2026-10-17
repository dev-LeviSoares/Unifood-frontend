import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { demoOrders, DEMO_STEPS } from '../../services/storage/demoOrders';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { StudentPage } from './StudentPage';
import { Icon } from '../../components/marketplace/Icon';
import { OrderSummary } from '../../components/marketplace/OrderSummary';

const paymentLabels = {
  pix: 'Pix demonstrativo · sem cobrança',
  'credit-card': 'Cartão de crédito demonstrativo · sem cobrança',
  pickup: 'Pagamento na retirada',
};

export function StudentOrderDetail() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState('');
  const order = demoOrders.get(user.id, orderId);
  const step = order?.step ?? 0;
  function advance() {
    try {
      demoOrders.advance(user.id, orderId);
      setRevision(revision + 1);
    } catch {
      setError('Não foi possível atualizar a simulação neste navegador.');
    }
  }
  return (
    <StudentPage title="Acompanhar pedido" narrow>
      <Link className="uf-back" to={ROUTES.STUDENT_ORDERS}>
        <Icon name="arrow" size={18} />
        Meus pedidos
      </Link>
      {!order ? (
        <div className="uf-empty">
          <h1>Pedido não encontrado</h1>
          <p>Este pedido não está salvo para sua conta neste navegador.</p>
          <Link className="uf-button" to={ROUTES.STUDENT_ORDERS}>
            Ver meus pedidos
          </Link>
        </div>
      ) : (
        <>
          <section className="uf-order-hero">
            <span className="uf-confirmed">
              <Icon name="check" size={28} />
            </span>
            <h1>
              {step === 3
                ? 'Retirado. Bom apetite!'
                : 'Deu bom! Pedido confirmado.'}
            </h1>
            <p>
              Pedido #{order.id.slice(0, 8).toUpperCase()} ·{' '}
              {order.sellerName || 'Seu vendedor'}
            </p>
            <span className="uf-tag">
              {paymentLabels[order.paymentMethod] || 'Pagamento na retirada'} ·{' '}
              {formatCurrency(order.totalInCents)}
            </span>
          </section>
          <div className="uf-notice">
            <Icon name="shield" />
            <p>
              Demonstração: use o botão abaixo para simular o preparo. Os
              estados não vêm de um vendedor real.
            </p>
          </div>
          <section className="uf-panel uf-estimate">
            <small>PREVISÃO DE RETIRADA</small>
            <h2>{order.pickupTime || 'Horário a combinar'}</h2>
            <p>Em uma compra real, confirme o horário com o vendedor.</p>
          </section>
          <section className="uf-panel">
            <h2>Acompanhe seu lanche</h2>
            <ol className="uf-timeline">
              {DEMO_STEPS.map((label, index) => (
                <li className={index <= step ? 'is-complete' : ''} key={label}>
                  <span>
                    {index <= step ? (
                      <Icon name="check" size={15} />
                    ) : (
                      <Icon name="clock" size={15} />
                    )}
                  </span>
                  <div>
                    <strong>{label}</strong>
                    <p>
                      {index === step
                        ? 'Etapa atual da simulação'
                        : index < step
                          ? 'Etapa concluída na simulação'
                          : 'Aguardando próxima etapa'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            {step < 3 && (
              <button
                className="uf-button uf-button--secondary"
                onClick={advance}
              >
                Simular: {DEMO_STEPS[step + 1]}
              </button>
            )}
            {error && (
              <p role="alert" className="uf-error">
                {error}
              </p>
            )}
          </section>
          <section className="uf-panel">
            <h2>Seu ponto de encontro</h2>
            <div className="uf-pickup-card">
              <Icon name="pin" />
              <div>
                <h3>{order.pickupPoint}</h3>
                <p>{order.campus}</p>
                <small>
                  Retirada no campus. Sem entrega nem taxa de frete.
                </small>
              </div>
            </div>
          </section>
          <section className="uf-pickup-code">
            <h2>Seu código de retirada</h2>
            <strong>{order.pickupCode || '—'}</strong>
            <p>
              Código demonstrativo. Em uma compra real, mostre ao vendedor no
              momento da retirada.
            </p>
          </section>
          <details className="uf-panel">
            <summary>Ver detalhes do pedido</summary>
            <OrderSummary
              items={order.items}
              totalInCents={order.totalInCents}
            />
            {order.note && <p>Observações: {order.note}</p>}
          </details>
          <Link
            className="uf-button uf-button--secondary uf-full"
            to={`${ROUTES.SELLERS}/${order.sellerId}`}
          >
            <Icon name="chat" size={18} />
            Ver vendedor e informações de retirada
          </Link>
          <Link
            className="uf-text-link uf-center-link"
            to={`${ROUTES.STUDENT_PROFILE}?section=help`}
          >
            Precisa de ajuda?
          </Link>
        </>
      )}
    </StudentPage>
  );
}
