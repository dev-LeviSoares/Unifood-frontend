import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useMarketplace } from '../../../hooks/useMarketplace';
import { useProductActions } from '../../../hooks/useProductActions';
import { StudentPage } from '../StudentPage';
import { ProductCard } from '../../../components/marketplace/ProductCard';
import { CatalogSkeleton } from '../../../components/marketplace/CatalogSkeleton';
import { Icon } from '../../../components/marketplace/Icon';

export function SellerMenu() {
  const { sellerId } = useParams();
  const { sellers, products, loading, demo } = useMarketplace();
  const { add } = useProductActions();
  const seller = sellers.find((item) => item.id === sellerId);
  const menu = products.filter((product) => product.sellerId === sellerId);
  const categories = [
    ...new Set(menu.map((product) => product.category || 'Outros')),
  ];
  return (
    <StudentPage title="Cardápio de hoje" cartBar>
      <Link className="uf-back" to={`${ROUTES.SELLERS}/${sellerId}`}>
        <Icon name="arrow" size={18} />
        Ver perfil do vendedor
      </Link>
      {loading ? (
        <CatalogSkeleton />
      ) : !seller ? (
        <div className="uf-empty">
          <h1>Cardápio não encontrado</h1>
          <Link className="uf-button" to={ROUTES.SELLERS}>
            Explorar o campus
          </Link>
        </div>
      ) : (
        <>
          <div className="uf-page-heading">
            <div>
              <span className="uf-tag">
                {seller.status === 'CLOSED'
                  ? 'Fechado agora'
                  : 'Hoje no campus'}
              </span>
              <h1>{seller.name}</h1>
              <p>Escolha seu lanche e deixe seu intervalo encaminhado.</p>
            </div>
          </div>
          {menu.length ? (
            categories.map((category) => (
              <section className="uf-section" key={category}>
                <div className="uf-section-heading">
                  <h2>{category}</h2>
                </div>
                <div className="uf-product-grid">
                  {menu
                    .filter(
                      (product) => (product.category || 'Outros') === category,
                    )
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
            ))
          ) : (
            <div className="uf-empty">
              <h2>O cardápio ainda está vazio</h2>
              <p>Volte mais tarde para conferir as opções.</p>
              <Link to={ROUTES.SELLERS}>Ver outros vendedores</Link>
            </div>
          )}
          {demo && <p className="uf-demo-label">Cardápio de demonstração.</p>}
        </>
      )}
    </StudentPage>
  );
}
