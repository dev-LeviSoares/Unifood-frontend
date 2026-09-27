import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MarketplaceHeader } from './marketplace/MarketplaceHeader';
import './marketplace/marketplace.css';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function Cart() {
  useDocumentTitle('Carrinho');
  const { items, totalInCents, updateQuantity, removeItem, clear } = useCart();

  return (
    <div className="marketplace-page">
      <MarketplaceHeader />
      <main className="marketplace-container cart-page">
        <Link className="marketplace-back" to={ROUTES.SELLERS}>← Continuar explorando</Link>

        <section className="cart-heading">
          <span className="marketplace-eyebrow">Seu intervalo, já encaminhado</span>
          <h1>Seu carrinho</h1>
          <p>Confira seus itens antes de seguir para a retirada.</p>
        </section>

        {items.length === 0 ? (
          <section className="marketplace-empty cart-empty">
            <span aria-hidden="true">🛒</span>
            <h2>Seu carrinho está esperando um lanche</h2>
            <p>Explore os vendedores da sua universidade e escolha o que você quer retirar.</p>
            <Link to={ROUTES.SELLERS}>
              <Button size="lg">Explorar vendedores</Button>
            </Link>
          </section>
        ) : (
          <section className="cart-layout" aria-label="Itens do carrinho">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.productId}>
                  <div className="cart-item__info">
                    <h2>{item.name}</h2>
                    <span>{formatCurrency(item.unitPriceInCents)} por unidade</span>
                  </div>
                  <label className="quantity-control">
                    <span>Quantidade</span>
                    <select
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    >
                      {Array.from({ length: Math.max(item.quantity, 10) }, (_, index) => index + 1).map((quantity) => (
                        <option key={quantity} value={quantity}>{quantity}</option>
                      ))}
                    </select>
                  </label>
                  <strong>{formatCurrency(item.unitPriceInCents * item.quantity)}</strong>
                  <Button variant="ghost" onClick={() => removeItem(item.productId)}>Remover</Button>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <span>Resumo do pedido</span>
              <strong>{formatCurrency(totalInCents)}</strong>
              <p>O pagamento e a retirada serão combinados diretamente com o vendedor.</p>
              <Button size="lg" fullWidth disabled>Continuar para confirmação</Button>
              <Button variant="ghost" fullWidth onClick={clear}>Limpar carrinho</Button>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
