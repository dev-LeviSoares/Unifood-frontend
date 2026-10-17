import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useCart } from '../../contexts/CartContext';
import { marketplaceSellers } from '../../data/marketplaceMock';
import { formatCurrency } from '../../utils/formatCurrency';
import { QuantityControl } from '../../components/marketplace/QuantityControl';
import { OrderSummary } from '../../components/marketplace/OrderSummary';
import { Icon } from '../../components/marketplace/Icon';
import { StudentPage } from './StudentPage';

export function Cart() {
  const { items, sellerId, totalInCents, updateQuantity, removeItem, clear } =
    useCart();
  const seller = marketplaceSellers.find((item) => item.id === sellerId);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [error, setError] = useState('');
  function change(action) {
    try {
      action();
      setError('');
    } catch {
      setError(
        'Não foi possível salvar a alteração no navegador. Tente novamente.',
      );
    }
  }
  return (
    <StudentPage
      title="Seu carrinho"
      heading="Seu intervalo está quase pronto."
      subtitle={
        count
          ? `${count} ${count === 1 ? 'item' : 'itens'}${seller ? ` de ${seller.name}` : ''}. Uma só retirada, sem taxa.`
          : 'Seu próximo lanche começa aqui.'
      }
    >
      <Link className="uf-back" to={ROUTES.SELLERS}>
        <Icon name="arrow" size={18} />
        Continuar explorando
      </Link>
      {!items.length ? (
        <div className="uf-empty">
          <Icon name="bag" size={36} />
          <h2>Seu carrinho está esperando um lanche</h2>
          <p>Explore o cardápio do campus e encontre seu favorito.</p>
          <Link className="uf-button" to={ROUTES.SELLERS}>
            Explorar vendedores e lanches
          </Link>
        </div>
      ) : (
        <div className="uf-checkout-layout">
          <div>
            <section className="uf-panel">
              <h2 className="uf-panel-title">
                <Icon name="bag" size={20} />
                {seller?.name || 'Seu vendedor'}
              </h2>
              {items.map((item) => (
                <article className="uf-cart-item" key={item.productId}>
                  <Link to={`${ROUTES.PRODUCT}/${item.productId}`}>
                    <img
                      src={item.imageUrl || '/images/food/burger.webp'}
                      alt={item.name}
                    />
                  </Link>
                  <div className="uf-cart-item-info">
                    <Link to={`${ROUTES.PRODUCT}/${item.productId}`}>
                      <h2>
                        {item.quantity}× {item.name}
                      </h2>
                    </Link>
                    <small>{formatCurrency(item.unitPriceInCents)} cada</small>
                    {item.note && <small>{item.note}</small>}
                    <QuantityControl
                      value={item.quantity}
                      onChange={(value) =>
                        change(() => updateQuantity(item.productId, value))
                      }
                      max={item.stock ?? 99}
                      name={item.name}
                    />
                  </div>
                  <div className="uf-cart-item-end">
                    <button
                      type="button"
                      className="uf-remove"
                      onClick={() => change(() => removeItem(item.productId))}
                      aria-label={`Remover ${item.name}`}
                    >
                      <Icon name="close" size={16} />
                    </button>
                    <strong>
                      {formatCurrency(item.unitPriceInCents * item.quantity)}
                    </strong>
                  </div>
                </article>
              ))}
              <Link
                className="uf-text-link"
                to={`${ROUTES.SELLERS}/${sellerId}/cardapio`}
              >
                + Adicionar mais itens deste vendedor
              </Link>
            </section>
            <section className="uf-panel uf-coupon">
              <div>
                <strong>Tem um cupom?</strong>
                <button
                  className="uf-text-button"
                  onClick={() => {
                    setCouponOpen(!couponOpen);
                    setCouponError('');
                  }}
                >
                  {couponOpen ? 'Fechar' : 'Adicionar'}
                </button>
              </div>
              {couponOpen && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setCouponError(
                      coupon.trim()
                        ? 'Cupons ainda não estão disponíveis nesta demonstração. Nenhum desconto foi aplicado.'
                        : 'Digite um código para consultar.',
                    );
                  }}
                >
                  <label className="uf-field">
                    Cupom de desconto
                    <input
                      value={coupon}
                      onChange={(event) => setCoupon(event.target.value)}
                      placeholder="Seu código"
                    />
                  </label>
                  <button className="uf-button uf-button--secondary">
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && (
                <p className="uf-error" role="alert">
                  {couponError}
                </p>
              )}
            </section>
            <button className="uf-text-button" onClick={() => change(clear)}>
              Limpar carrinho
            </button>
            {error && (
              <p className="uf-error" role="alert">
                {error}
              </p>
            )}
          </div>
          <aside className="uf-panel uf-checkout-summary">
            <h2>Resumo do pedido</h2>
            <OrderSummary items={items} totalInCents={totalInCents} compact />
            <p className="uf-notice">
              No próximo passo, confira o ponto de encontro no campus e como
              deseja pagar.
            </p>
            <Link className="uf-button" to={ROUTES.CHECKOUT}>
              Finalizar pedido · {formatCurrency(totalInCents)}
            </Link>
            <small>Retirada no campus. Sem taxa de entrega.</small>
          </aside>
        </div>
      )}
    </StudentPage>
  );
}
