import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useMarketplace } from '../../../hooks/useMarketplace';
import { useProductActions } from '../../../hooks/useProductActions';
import { StudentPage } from '../StudentPage';
import { ProductCard } from '../../../components/marketplace/ProductCard';
import { CatalogSkeleton } from '../../../components/marketplace/CatalogSkeleton';
import { Icon } from '../../../components/marketplace/Icon';

export function SellerProfile() {
  const { sellerId } = useParams();
  const { sellers, products, loading, demo } = useMarketplace();
  const { add } = useProductActions();
  const seller = sellers.find((item) => item.id === sellerId);
  return (
    <StudentPage title="Vendedor" cartBar>
      <Link className="uf-back" to={`${ROUTES.SELLERS}?view=sellers`}>
        <Icon name="arrow" size={18} />
        Voltar para vendedores
      </Link>
      {loading ? (
        <CatalogSkeleton />
      ) : !seller ? (
        <div className="uf-empty">
          <h1>Vendedor não encontrado</h1>
          <Link className="uf-button" to={ROUTES.SELLERS}>
            Explorar o campus
          </Link>
        </div>
      ) : (
        <>
          <section className="uf-panel uf-seller-profile">
            <div className="uf-seller-avatar">{seller.name?.slice(0, 1)}</div>
            <div>
              <span className="uf-tag">
                {seller.status === 'CLOSED'
                  ? 'Fechado agora'
                  : 'Confira o cardápio de hoje'}
              </span>
              <h1>{seller.name}</h1>
              <p>{seller.description}</p>
              <span className="uf-small">
                {seller.campus || 'Seu campus'} · {seller.pickupTime}
              </span>
            </div>
            <Link
              className="uf-button"
              to={`${ROUTES.SELLERS}/${sellerId}/cardapio`}
            >
              Ver cardápio de hoje
            </Link>
          </section>
          <section className="uf-panel">
            <h2>Seu ponto de encontro</h2>
            <div className="uf-pickup-card">
              <Icon name="pin" />
              <div>
                <h3>{seller.pickupPoint || 'Ponto a combinar no campus'}</h3>
                <p>
                  {seller.pickupInstructions ||
                    'Combine o ponto de encontro com o vendedor.'}
                </p>
                <small>
                  Retirada no campus. Sem entrega nem taxa de frete.
                </small>
              </div>
            </div>
          </section>
          <section className="uf-section">
            <div className="uf-section-heading">
              <h2>Uma prévia do cardápio</h2>
              <Link to={`${ROUTES.SELLERS}/${sellerId}/cardapio`}>
                Ver tudo →
              </Link>
            </div>
            <div className="uf-product-grid">
              {products
                .filter((product) => product.sellerId === sellerId)
                .slice(0, 3)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    seller={seller}
                    onAdd={add}
                  />
                ))}
            </div>
          </section>
          {demo && (
            <p className="uf-demo-label">
              Vendedor e cardápio de demonstração. Não há atendimento real por
              esta tela.
            </p>
          )}
        </>
      )}
    </StudentPage>
  );
}
