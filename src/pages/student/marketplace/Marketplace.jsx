import { useSearchParams, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useMarketplace } from '../../../hooks/useMarketplace';
import { useProductActions } from '../../../hooks/useProductActions';
import { StudentPage } from '../StudentPage';
import { Categories } from '../../../components/marketplace/Categories';
import { SearchField } from '../../../components/marketplace/SearchField';
import { ProductCard } from '../../../components/marketplace/ProductCard';
import { Icon } from '../../../components/marketplace/Icon';
import { CatalogSkeleton } from '../../../components/marketplace/CatalogSkeleton';

const normalize = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
function categoryMatches(product, category) {
  if (!category) return true;
  if (category === 'Lanches')
    return /lanche|sandu|mais pedidos/i.test(product.category || '');
  return normalize(product.category).includes(normalize(category));
}
export function Marketplace() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'recommended';
  const view = params.get('view') || 'products';
  const { products, sellers, loading, demo } = useMarketplace();
  const { add } = useProductActions();
  function filter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }
  const matched = products.filter(
    (product) =>
      categoryMatches(product, category) &&
      normalize(
        [
          product.name,
          product.description,
          sellers.find((seller) => seller.id === product.sellerId)?.name,
        ].join(' '),
      ).includes(normalize(query)),
  );
  const ordered = [...matched].sort((a, b) =>
    sort === 'price' ? a.priceInCents - b.priceInCents : 0,
  );
  const matchingSellers = sellers.filter((seller) =>
    normalize(
      [seller.name, seller.category, seller.description].join(' '),
    ).includes(normalize(query)),
  );
  const recommendations = products
    .filter(
      (product) =>
        !matched.includes(product) &&
        product.available !== false &&
        product.stock !== 0,
    )
    .slice(0, 4);
  return (
    <StudentPage
      title="Buscar"
      heading="Encontre seu próximo favorito."
      cartBar
    >
      <SearchField
        key={query}
        value={query}
        onSearch={(value) => filter('q', value)}
        label="Pesquisar vendedores e lanches"
      />
      <p className="uf-search-campus">
        <Icon name="pin" size={15} />
        Buscando no Campus Central{' '}
        {demo && <span className="uf-tag">Demo</span>}
      </p>
      <div className="uf-filter-row">
        <Categories
          selected={category}
          onSelect={(value) => filter('category', value)}
        />
        <select
          className="uf-sort"
          aria-label="Ordenar resultados"
          value={sort}
          onChange={(event) => filter('sort', event.target.value)}
        >
          <option value="recommended">Recomendados</option>
          <option value="price">Menor preço</option>
        </select>
      </div>
      <div className="uf-tabs" aria-label="Tipo de resultado">
        <button
          className={view === 'products' ? 'is-selected' : ''}
          onClick={() => filter('view', 'products')}
        >
          Lanches
        </button>
        <button
          className={view === 'sellers' ? 'is-selected' : ''}
          onClick={() => filter('view', 'sellers')}
        >
          Vendedores
        </button>
      </div>
      {loading ? (
        <CatalogSkeleton />
      ) : view === 'products' ? (
        <>
          <div className="uf-section-heading">
            <div>
              <h2>
                {ordered.length}{' '}
                {ordered.length === 1 ? 'resultado' : 'resultados'}
              </h2>
              {query && <p>Para “{query}”</p>}
            </div>
            {(query || category) && (
              <button className="uf-text-button" onClick={() => setParams({})}>
                Limpar filtros
              </button>
            )}
          </div>
          {ordered.length ? (
            <div className="uf-product-grid">
              {ordered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  seller={sellers.find(
                    (seller) => seller.id === product.sellerId,
                  )}
                  onAdd={add}
                />
              ))}
            </div>
          ) : (
            <div className="uf-empty">
              <Icon name="search" size={32} />
              <h2>Nenhum lanche por aqui</h2>
              <p>Tente outro nome ou categoria para encontrar seu favorito.</p>
              <button className="uf-button" onClick={() => setParams({})}>
                Ver todos os lanches
              </button>
            </div>
          )}
          {recommendations.length > 0 && (
            <section className="uf-section">
              <div className="uf-section-heading">
                <div>
                  <h2>Combina com seu intervalo</h2>
                  <p>Outras delícias disponíveis agora.</p>
                </div>
              </div>
              <div className="uf-product-grid">
                {recommendations.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    seller={sellers.find(
                      (seller) => seller.id === product.sellerId,
                    )}
                    onAdd={add}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="uf-seller-grid">
          {matchingSellers.length ? (
            matchingSellers.map((seller) => (
              <article className="uf-panel uf-seller-card" key={seller.id}>
                <div className="uf-seller-avatar">
                  {seller.name?.slice(0, 1)}
                </div>
                <h2>{seller.name}</h2>
                <p>{seller.description}</p>
                <span className="uf-tag">
                  {seller.status === 'CLOSED'
                    ? 'Fechado agora'
                    : 'Ver disponibilidade no cardápio'}
                </span>
                <Link
                  className="uf-button uf-button--secondary"
                  to={`${ROUTES.SELLERS}/${seller.id}`}
                >
                  Ver cardápio
                </Link>
              </article>
            ))
          ) : (
            <div className="uf-empty">
              <h2>Nenhum vendedor encontrado</h2>
              <button onClick={() => filter('q', '')}>Limpar busca</button>
            </div>
          )}
        </section>
      )}
    </StudentPage>
  );
}
