import '../../styles/home-combo-banner.css';
import { readLocalData } from '../../services/storage/localData';
import { CatalogSkeleton } from '../../components/marketplace/CatalogSkeleton';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useProductActions } from '../../hooks/useProductActions';
import { StudentPage } from '../student/StudentPage';
import { Icon } from '../../components/marketplace/Icon';
import { SearchField } from '../../components/marketplace/SearchField';
import { Categories } from '../../components/marketplace/Categories';
import { ProductCard } from '../../components/marketplace/ProductCard';

export function Home() {
  const { user } = useAuth();
  const profile = user ? readLocalData(`unifood_profile:${user.id}`, {}) : {};
  const firstName = (profile.name || user?.name || '').split(' ')[0];
  const { products, sellers, loading, demo } = useMarketplace();
  const { add } = useProductActions();
  const navigate = useNavigate();
  const [sort, setSort] = useState('recommended');
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const featuredIds = [
    'x-burguer',
    'coxinha-frango',
    'brigadeiro-gourmet',
    'suco-laranja',
  ];
  const available = products
    .filter(
      (product) =>
        product.available !== false &&
        product.stock !== 0 &&
        sellers.find((seller) => seller.id === product.sellerId)?.status !==
          'CLOSED',
    )
    .sort((a, b) => {
      const rank = (product) => {
        const index = featuredIds.indexOf(product.id);
        return index === -1 ? 99 : index;
      };
      return rank(a) - rank(b);
    });
  const ordered = [...products].sort((a, b) =>
    sort === 'price' ? a.priceInCents - b.priceInCents : 0,
  );
  const search = (value) =>
    navigate(
      `${ROUTES.SELLERS}${value ? `?q=${encodeURIComponent(value)}` : ''}`,
    );
  return (
    <StudentPage title="Seu intervalo começa aqui" cartBar>
      <section className="uf-home-intro">
        <div>
          <p className="uf-greeting">
            {greeting}
            {firstName ? `, ${firstName}` : ''}{' '}
            <span className="uf-sun" aria-hidden="true">
              ✺
            </span>
          </p>
          <h1>Seu intervalo merece um lanche bom.</h1>
        </div>
        <span className="uf-campus">
          <Icon name="pin" size={16} />
          Campus Central{demo && <small>Demo</small>}
        </span>
      </section>
      <div className="uf-home-search">
        <SearchField onSearch={search} />
      </div>
      <div className="uf-trending">
        <span>Buscas em alta</span>
        {['Coxinha', 'Suco', 'Chocolate'].map((term) => (
          <button key={term} onClick={() => search(term)}>
            {term}
          </button>
        ))}
      </div>
      <section className="uf-offer uf-offer--breakout" aria-labelledby="combo-heading">
        <div className="uf-offer__copy">
          <span>OFERTAS QUE SALVAM O INTERVALO</span>

          <h2 id="combo-heading">
            Tá com fome?
            <br />
            Confira as ofertas
          </h2>

          <p>Comida boa, preço de estudante e retirada no seu campus.</p>

          <Link className="uf-button uf-button--white" to={ROUTES.SELLERS}>
            Bora aproveitar <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="uf-offer__art">
          <img
            src="/images/food/hero-combo-breakout.png"
            alt="Hambúrguer e Coca-Cola atravessando a borda de um painel laranja, com pequenos fragmentos ao redor"
            width="1774"
            height="887"
            decoding="async"
          />
        </div>
      </section>
      <Categories
        selected="Lanches"
        onSelect={(category) =>
          navigate(
            `${ROUTES.SELLERS}${category ? `?category=${encodeURIComponent(category)}` : ''}`,
          )
        }
      />
      <section className="uf-section">
        <div className="uf-section-heading">
          <div>
            <h2>
              <Icon name="flame" />
              Mais pedidos
            </h2>
            <p>Os favoritos da galera. Disponíveis agora.</p>
          </div>
          <Link to={ROUTES.SELLERS}>
            Ver todos <span aria-hidden="true">→</span>
          </Link>
        </div>
        {loading ? (
          <CatalogSkeleton />
        ) : (
          <div className="uf-featured-grid">
            {available.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                seller={sellers.find(
                  (seller) => seller.id === product.sellerId,
                )}
                onAdd={add}
                featured
              />
            ))}
          </div>
        )}
      </section>
      <section className="uf-section">
        <div className="uf-section-heading">
          <div>
            <h2>O que você vai comer?</h2>
            <p>Conheça quem prepara o seu próximo lanche.</p>
          </div>
          <select
            className="uf-sort"
            aria-label="Ordenar produtos"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="recommended">Recomendados</option>
            <option value="price">Menor preço</option>
          </select>
        </div>
        {loading ? (
          <CatalogSkeleton />
        ) : (
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
        )}
        {!loading && !products.length && (
          <div className="uf-empty">
            <h3>O cardápio ainda está sendo preparado</h3>
            <Link to={ROUTES.SELLERS}>Conhecer vendedores</Link>
          </div>
        )}
      </section>
      <section className="uf-campus-note">
        <Icon name="heart" />
        <div>
          <h2>Da cozinha de um aluno para você.</h2>
          <p>
            Escolha, combine o ponto de retirada e encontre o vendedor no
            campus. Sem entrega, sem complicação.
          </p>
        </div>
        <Link to={ROUTES.SELLERS}>Conheça os vendedores →</Link>
      </section>
      {demo && (
        <p className="uf-demo-label">
          Você está explorando um catálogo de demonstração.
        </p>
      )}
    </StudentPage>
  );
}
