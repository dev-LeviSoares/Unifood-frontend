import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { sellerService } from '../../../services/api/sellerService';
import { marketplaceSellers, marketplaceProducts } from '../../../data/marketplaceMock';
import { ROUTES } from '../../../constants/routes';
import { MarketplaceHeader } from './MarketplaceHeader';
import { formatCurrency } from '../../../utils/formatCurrency';
import './marketplace.css';

export function SellerProfile() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadSeller() {
      try {
        const data = await sellerService.getById(sellerId);
        if (active) setSeller(data);
      } catch {
        const fallback = marketplaceSellers.find((item) => item.id === sellerId);
        if (active) {
          setSeller(fallback ?? null);
          if (!fallback) setError('Vendedor não encontrado.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSeller();
    return () => { active = false; };
  }, [sellerId]);

  const featuredProducts = marketplaceProducts.filter((product) => product.sellerId === sellerId).slice(0, 3);

  if (loading) return <div className="marketplace-page"><MarketplaceHeader /><main className="marketplace-container"><div className="marketplace-loading">Abrindo o perfil do vendedor...</div></main></div>;
  if (error || !seller) return <div className="marketplace-page"><MarketplaceHeader /><main className="marketplace-container"><div className="marketplace-empty"><h2>{error || 'Vendedor não encontrado.'}</h2><Link to={ROUTES.SELLERS}>Voltar para vendedores</Link></div></main></div>;

  return (
    <div className="marketplace-page">
      <MarketplaceHeader />
      <main className="marketplace-container">
        <Link className="marketplace-back" to={ROUTES.SELLERS}>← Voltar para vendedores</Link>
        <section className="seller-profile-hero">
          <div className="seller-profile-hero__avatar" aria-hidden="true">{seller.name?.slice(0, 2).toUpperCase()}</div>
          <div className="seller-profile-hero__content">
            <span className="marketplace-eyebrow">{seller.campus || 'Sua universidade'}</span>
            <h1>{seller.name}</h1>
            <p>{seller.description}</p>
            <div className="seller-profile-hero__status">
              {seller.status === 'OPEN' ? <Badge tone="success">Pedidos disponíveis</Badge> : <Badge tone="neutral">Fechado agora</Badge>}
              <span>{seller.pickupTime}</span>
            </div>
          </div>
          <Link to={`${ROUTES.SELLERS}/${seller.id}/cardapio`}>
            <Button size="lg">Ver cardápio de hoje</Button>
          </Link>
        </section>

        <section className="marketplace-section">
          <div className="marketplace-section__heading">
            <div><span className="marketplace-section__kicker">Uma prévia</span><h2>O que está no cardápio</h2></div>
          </div>
          <div className="product-preview-grid">
            {featuredProducts.map((product) => (
              <Link className="product-mini-card" key={product.id} to={`${ROUTES.PRODUCT}/${product.id}`}>
                <div className="product-mini-card__image">{product.name.slice(0, 1)}</div>
                <div><h3>{product.name}</h3><strong>{formatCurrency(product.priceInCents)}</strong></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
