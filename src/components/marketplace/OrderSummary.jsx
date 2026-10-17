import { formatCurrency } from '../../utils/formatCurrency';
export function OrderSummary({ items, totalInCents, compact = false }) {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="uf-order-summary">
      {!compact && (
        <div className="uf-summary-items">
          {items.map((item) => (
            <div className="uf-summary-item" key={item.productId}>
              <img src={item.imageUrl || '/images/food/burger.webp'} alt="" />
              <div>
                <strong>
                  {item.quantity}× {item.name}
                </strong>
                <small>{formatCurrency(item.unitPriceInCents)} cada</small>
                {item.note && <small>Obs.: {item.note}</small>}
              </div>
              <strong>
                {formatCurrency(item.unitPriceInCents * item.quantity)}
              </strong>
            </div>
          ))}
        </div>
      )}
      <dl className="uf-totals">
        <div>
          <dt>
            Subtotal · {count} {count === 1 ? 'item' : 'itens'}
          </dt>
          <dd>{formatCurrency(totalInCents)}</dd>
        </div>
        <div>
          <dt>Retirada no campus</dt>
          <dd className="uf-accent">Grátis</dd>
        </div>
        <div className="uf-total">
          <dt>Total</dt>
          <dd>{formatCurrency(totalInCents)}</dd>
        </div>
      </dl>
    </div>
  );
}
