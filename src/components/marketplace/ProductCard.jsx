import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { Icon } from './Icon';
export function ProductCard({ product, seller, onAdd, featured = false }) {
  const unavailable =
    product.available === false ||
    product.stock === 0 ||
    seller?.status === 'CLOSED';
  return (
    <article
      className={`uf-product-card${unavailable ? ' is-unavailable' : ''}`}
    >
      <Link
        className="uf-product-photo"
        to={`${ROUTES.PRODUCT}/${product.id}`}
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.imageUrl || '/images/food/burger.webp'}
          alt={product.name}
          loading="lazy"
        />
        {(unavailable || featured) && (
          <span className={`uf-photo-tag${unavailable ? ' is-muted' : ''}`}>
            {unavailable
              ? product.stock === 0
                ? 'Esgotado hoje'
                : 'Indisponível agora'
              : 'Mais pedidos'}
          </span>
        )}
      </Link>
      <div className="uf-product-body">
        <Link to={`${ROUTES.PRODUCT}/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <Link
          className="uf-product-seller"
          to={`${ROUTES.SELLERS}/${product.sellerId}`}
        >
          {seller?.name || 'Ver vendedor'}
        </Link>
        <div className="uf-product-bottom">
          <strong>{formatCurrency(product.priceInCents)}</strong>
          <button
            className="uf-add"
            type="button"
            disabled={unavailable}
            onClick={() => onAdd(product)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
