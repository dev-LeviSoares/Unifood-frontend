import { Link } from 'react-router-dom';
import { marketplaceProducts, marketplaceSellers } from '../../data/marketplaceMock';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { MarketplaceHeader } from '../student/marketplace/MarketplaceHeader';
import './public-home.css';

const categories = [
  {
    label: 'Lanches',
    image: '/images/categories/product-burger.webp',
  },
  {
    label: 'Bebidas',
    image: '/images/categories/product-juice.webp',
  },
  {
    label: 'Salgados',
    image: '/images/categories/product-coxinha.webp',
  },
  {
    label: 'Doces',
    image: '/images/categories/product-sweet.webp',
  },
];

export function Home() {
  const featured = marketplaceProducts.filter((product) => product.available && product.stock > 0).slice(0, 3);

  return (
    <main className="public-home">
      <MarketplaceHeader />

      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-kicker">Seu intervalo começa aqui</span>
          <h1>Seu lanche, sem perder tempo entre uma aula e outra.</h1>
          <p>Descubra o que está disponível na sua universidade, peça antes e retire direto com o vendedor.</p>
          <div className="home-hero__actions">
            <Link className="home-primary-action" to={ROUTES.SELLERS}>Ver vendedores <span>→</span></Link>
            <Link className="home-secondary-action" to={ROUTES.REGISTER}>Criar minha conta</Link>
          </div>
          <div className="home-trust-row">
            <span><i>✓</i> Descubra opções</span>
            <span><i>✓</i> Peça antecipadamente</span>
            <span><i>✓</i> Retire direto</span>
          </div>
        </div>
          <div className="home-hero__visual" aria-hidden="true">
          <div className="food-orbit food-orbit--one"><img src="/images/categories/product-hot-dog.webp" alt=''></img></div>
          <div className="food-orbit food-orbit--two"><img src="/images/categories/product-fruit-drink.webp" alt='' /></div>
          <div className="hero-food-card">
            <span className="hero-food-card__badge">intervalo</span>
            <div className="hero-food-card__food"><img src="/images/categories/hero-cover.webp" alt=''></img></div>
            <strong>Seu próximo lanche</strong>
            <small>Escolha. Peça. Retire.</small>
          </div>
        </div>
      </section>

      <section className="home-content home-content--tight">
        <div className="home-section-heading">
          <div>
            <span>Descubra</span>
            <h2>O que você está com vontade de comer?</h2>
          </div>
          <Link to={ROUTES.SELLERS}>Ver tudo →</Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={ROUTES.SELLERS}
              className="category-card"
              key={category.label}
            >
              <img
                src={category.image}
                alt={category.label}
                loading="lazy"
              />
              <strong>{category.label}</strong>
              <small>Encontrar opções</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-content">
        <div className="home-section-heading">
          <div>
            <span>Para sua próxima pausa</span>
            <h2>Opções para pedir hoje</h2>
          </div>
          <Link to={ROUTES.SELLERS}>Explorar cardápios →</Link>
        </div>
        <div className="home-product-grid">
          {featured.map((product) => (
            <Link className="home-product-card" to={`${ROUTES.PRODUCT}/${product.id}`} key={product.id}>
              <div className="home-product-card__image"><span>{product.name.slice(0, 1)}</span></div>
              <div className="home-product-card__body">
                <small>{product.category}</small>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatCurrency(product.priceInCents)}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-content">
        <div className="home-section-heading">
          <div>
            <span>Onde encontrar</span>
            <h2>Quem está servindo hoje</h2>
          </div>
          <Link to={ROUTES.SELLERS}>Todos os vendedores →</Link>
        </div>
        <div className="home-seller-strip">
          {marketplaceSellers.slice(0, 3).map((seller) => (
            <Link to={`${ROUTES.SELLERS}/${seller.id}`} className="home-seller-card" key={seller.id}>
              <div className="home-seller-card__avatar">{seller.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <small>{seller.campus}</small>
                <h3>{seller.name}</h3>
                <p>{seller.category} · {seller.pickupTime.replace('Pronto para retirada em até ', 'Retirada em até ')}</p>
              </div>
              <span>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-how-it-works">
        <div>
          <span className="home-kicker">Sem complicação</span>
          <h2>Do campus para o seu intervalo.</h2>
          <p>Você escolhe o que quer, deixa o pedido encaminhado e vai buscar quando estiver pronto.</p>
        </div>
        <div className="home-steps">
          <article><b>01</b><strong>Encontre</strong><p>Explore vendedores e cardápios disponíveis.</p></article>
          <article><b>02</b><strong>Peça</strong><p>Monte seu pedido antes de chegar para retirar.</p></article>
          <article><b>03</b><strong>Retire</strong><p>Vá direto ao vendedor e aproveite seu intervalo.</p></article>
        </div>
      </section>

      <footer className="public-home__footer">
        <div className="brand-lockup">
          <span className="brand-mark">
            <img
              src="/images/categories/unifood-logo.webp"
              alt="Unifood"
              className="unifood-logo"
            />
          </span>
          <span>UNIFOOD</span>
        </div>
        <p>Feito para deixar o intervalo mais simples.</p>
      </footer>
    </main>
  );
}
