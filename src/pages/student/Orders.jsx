import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { demoOrders } from '../../services/storage/demoOrders';
import { marketplaceProducts } from '../../data/marketplaceMock';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { StudentPage } from './StudentPage';
import { Icon } from '../../components/marketplace/Icon';

export function StudentOrders() {
  const { user } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const orders = demoOrders.list(user.id);
  const history = params.get('tab') === 'history';
  const current = orders.filter((order) => (order.step ?? 0) < 3);
  const completed = orders.filter((order) => order.step === 3);
  const shown = history ? completed : current;
  function repeat(order) {
    if (cart.items.length) {
      toast.error(
        'Seu carrinho já tem itens. Revise ou limpe antes de repetir um pedido.',
      );
      return;
    }
    const products = order.items.map((item) => ({
      product: marketplaceProducts.find(
        (product) => product.id === item.productId,
      ),
      item,
    }));
    if (
      products.some(
        ({ product, item }) =>
          !product ||
          product.available === false ||
          product.stock < item.quantity,
      )
    ) {
      toast.error(
        'Algum item não está disponível na quantidade do pedido anterior. Confira o cardápio.',
      );
      return;
    }
    for (const { product, item } of products) {
      const result = cart.addItem(
        { ...product, note: item.note },
        item.quantity,
      );
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
    }
    toast.success(
      'Itens adicionados. Confira seu carrinho antes de confirmar.',
    );
  }
  function rate(order, rating) {
    try {
      demoOrders.update(user.id, order.id, { rating });
      setRevision(revision + 1);
      toast.success('Avaliação salva nesta demonstração.');
    } catch {
      toast.error('Não foi possível salvar a avaliação.');
    }
  }
  return (
    <StudentPage
      title="Meus pedidos"
      heading="Seus lanches, por aqui."
      subtitle="Acompanhe a retirada e repita seus favoritos."
      cartBar
    >
      <div className="uf-tabs">
        <button
          className={!history ? 'is-selected' : ''}
          onClick={() => setParams({})}
        >
          Em andamento · {current.length}
        </button>
        <button
          className={history ? 'is-selected' : ''}
          onClick={() => setParams({ tab: 'history' })}
        >
          Histórico · {completed.length}
        </button>
      </div>
      <p className="uf-demo-label">
        Histórico de demonstração, salvo neste navegador.
      </p>
      {!shown.length ? (
        <div className="uf-empty">
          <Icon name="receipt" size={36} />
          <h2>
            {orders.length
              ? 'Nenhum pedido nesta aba'
              : 'Você ainda não tem pedidos'}
          </h2>
          <p>Seu próximo intervalo pode ser mais gostoso.</p>
          <Link className="uf-button" to={ROUTES.SELLERS}>
            Explorar lanches
          </Link>
        </div>
      ) : (
        <div className="uf-orders-grid">
          {shown.map((order) => (
            <article className="uf-panel uf-order-card" key={order.id}>
              <div className="uf-order-card-meta">
                <small>#{order.id.slice(0, 8).toUpperCase()}</small>
                <span className="uf-tag">{order.status}</span>
              </div>
              <div className="uf-order-card-main">
                <img
                  src={order.items[0]?.imageUrl || '/images/food/burger.webp'}
                  alt=""
                />
                <div>
                  <h2>{order.sellerName || 'Seu vendedor'}</h2>
                  <p>
                    {order.items
                      .map((item) => `${item.quantity}× ${item.name}`)
                      .join(' + ')}
                  </p>
                  <strong>{formatCurrency(order.totalInCents)}</strong>
                  <small>
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </small>
                </div>
              </div>
              <Link
                className={`uf-button${history ? ' uf-button--secondary' : ''}`}
                to={ROUTES.STUDENT_ORDER_DETAIL.replace(':orderId', order.id)}
              >
                {history ? 'Ver detalhes do pedido' : 'Acompanhar pedido'}
              </Link>
              {history && (
                <>
                  <button
                    className="uf-text-button"
                    onClick={() => repeat(order)}
                  >
                    Pedir novamente
                  </button>
                  <label className="uf-rating">
                    Avaliar pedido
                    <select
                      aria-label={`Avaliar pedido ${order.id}`}
                      value={order.rating || ''}
                      onChange={(event) =>
                        rate(order, Number(event.target.value))
                      }
                    >
                      <option value="">Escolha uma nota</option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value} {value === 1 ? 'estrela' : 'estrelas'}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </StudentPage>
  );
}
