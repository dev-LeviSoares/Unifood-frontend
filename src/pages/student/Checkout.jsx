import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { marketplaceSellers } from '../../data/marketplaceMock';
import { demoOrders } from '../../services/storage/demoOrders';
import {
  readLocalData,
  writeLocalData,
} from '../../services/storage/localData';
import { formatCurrency } from '../../utils/formatCurrency';
import { Icon } from '../../components/marketplace/Icon';
import { OrderSummary } from '../../components/marketplace/OrderSummary';
import { StudentPage } from './StudentPage';

export function Checkout() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const draftKey = `unifood_checkout:${user.id}`;
  const [draft, setDraft] = useState(() =>
    readLocalData(draftKey, { paymentMethod: 'pickup', note: '' }),
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitted = useRef(false);
  const seller = marketplaceSellers.find((item) => item.id === cart.sellerId);
  const savedProfile = readLocalData(`unifood_profile:${user.id}`, {});
  function update(values) {
    const next = { ...draft, ...values };
    setDraft(next);
    try {
      writeLocalData(draftKey, next);
    } catch {
      setError(
        'Seu navegador não conseguiu guardar as opções. Mantenha esta tela aberta.',
      );
    }
  }
  function confirm(event) {
    event.preventDefault();
    if (submitted.current) return;
    submitted.current = true;
    setBusy(true);
    setError('');
    try {
      const order = demoOrders.create(
        user.id,
        cart,
        draft.paymentMethod,
        draft.note?.trim() || '',
        seller,
      );
      // A confirmação foi persistida antes de esvaziar o carrinho.
      try {
        cart.clear();
      } catch {
        /* O pedido salvo ainda deve poder ser aberto. */
      }
      navigate(ROUTES.STUDENT_ORDER_DETAIL.replace(':orderId', order.id), {
        replace: true,
      });
    } catch {
      submitted.current = false;
      setBusy(false);
      setError(
        'Não foi possível salvar a simulação. Verifique o armazenamento deste navegador.',
      );
    }
  }
  return (
    <StudentPage
      title="Finalizar pedido"
      heading="Só falta combinar seu intervalo."
      subtitle="Confira o ponto de encontro e escolha como pagar."
    >
      <nav className="uf-breadcrumb" aria-label="Etapas da compra">
        <Link to={ROUTES.HOME}>Início</Link>
        <span>›</span>
        <Link to={ROUTES.CART}>Carrinho</Link>
        <span>›</span>
        <span>Retirada e pagamento</span>
      </nav>
      {!cart.items.length ? (
        <div className="uf-empty">
          <h2>Seu carrinho está vazio</h2>
          <Link className="uf-button" to={ROUTES.SELLERS}>
            Escolher um lanche
          </Link>
        </div>
      ) : (
        <form className="uf-checkout-layout" onSubmit={confirm}>
          <div>
            <section className="uf-panel">
              <h2>1. Onde você vai retirar?</h2>
              <div className="uf-pickup-card">
                <Icon name="pin" />
                <div>
                  <h3>{seller?.pickupPoint || 'Ponto a combinar no campus'}</h3>
                  <p>{seller?.campus || 'Campus Central'}</p>
                  <small>
                    {seller?.pickupInstructions ||
                      'Confirme o ponto com o vendedor antes da retirada.'}
                  </small>
                  <span className="uf-tag">
                    {seller?.pickupTime || 'Horário a combinar'}
                  </span>
                </div>
              </div>
              <p className="uf-small">
                Você encontra o vendedor neste ponto. Não há entrega nem taxa de
                frete.
              </p>
            </section>
            <section className="uf-panel">
              <h2>2. Como você quer pagar?</h2>
              <div className="uf-payment-options">
                {[
                  {
                    value: 'pix',
                    name: 'Pix',
                    icon: 'shield',
                    detail: 'Demonstração do fluxo de pagamento',
                  },
                  {
                    value: 'credit-card',
                    name: 'Cartão de crédito',
                    icon: 'card',
                    detail: 'Demonstração do fluxo de pagamento',
                  },
                  {
                    value: 'pickup',
                    name: 'Na retirada',
                    icon: 'bag',
                    detail: 'Combine diretamente com o vendedor',
                  },
                ].map((option) => (
                  <label
                    className={`uf-payment-option${draft.paymentMethod === option.value ? ' is-selected' : ''}`}
                    key={option.value}
                  >
                    <Icon name={option.icon} />
                    <span>
                      <strong>{option.name}</strong>
                      <small>{option.detail}</small>
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={draft.paymentMethod === option.value}
                      onChange={() => update({ paymentMethod: option.value })}
                    />
                  </label>
                ))}
              </div>
            </section>
            <section className="uf-panel">
              <div className="uf-section-heading">
                <h2>Quem vai retirar?</h2>
                <Link
                  className="uf-text-link"
                  to={`${ROUTES.STUDENT_PROFILE}?section=data`}
                  state={{ from: ROUTES.CHECKOUT }}
                >
                  Editar
                </Link>
              </div>
              <strong>{savedProfile.name || user.name || 'Estudante'}</strong>
              {user.email && <p className="uf-small">{user.email}</p>}
              <label className="uf-field uf-checkout-note">
                Observações (opcional)
                <textarea
                  maxLength={300}
                  value={draft.note || ''}
                  onChange={(event) => update({ note: event.target.value })}
                  placeholder="Algo que o vendedor precisa saber?"
                />
              </label>
            </section>
            <p className="uf-notice">
              <Icon name="shield" size={20} />
              Modo de demonstração: nenhum pedido é enviado ao vendedor e
              nenhuma cobrança é realizada.
            </p>
          </div>
          <aside className="uf-panel uf-checkout-summary">
            <div className="uf-section-heading">
              <h2>Seu pedido</h2>
              <Link className="uf-text-link" to={ROUTES.CART}>
                Editar carrinho
              </Link>
            </div>
            <p className="uf-small">{seller?.name || 'Seu vendedor'}</p>
            <OrderSummary items={cart.items} totalInCents={cart.totalInCents} />
            {error && (
              <p className="uf-error" role="alert">
                {error}
              </p>
            )}
            <button className="uf-button" type="submit" disabled={busy}>
              {busy
                ? 'Confirmando...'
                : `Confirmar pedido · ${formatCurrency(cart.totalInCents)}`}
            </button>
            <small>
              Confirmação de demonstração, sem transação financeira.
            </small>
          </aside>
        </form>
      )}
    </StudentPage>
  );
}
