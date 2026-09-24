import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { productService } from '../../../services/api/productService';
import { sellerService } from '../../../services/api/sellerService';
import { marketplaceProducts, marketplaceSellers } from '../../../data/marketplaceMock';
import { ROUTES } from '../../../constants/routes';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../contexts/ToastContext';
import { formatCurrency } from '../../../utils/formatCurrency';
import { MarketplaceHeader } from './MarketplaceHeader';
import './marketplace.css';

export function SellerMenu() {
  const { sellerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadMenu() {
      try {
        const [sellerData, productData] = await Promise.all([
          sellerService.getById(sellerId),
          productService.listBySeller(sellerId),
        ]);
        if (active) {
          setSeller(sellerData);
          setProducts(Array.isArray(productData) ? productData : productData?.items ?? productData?.products ?? []);
        }
      } catch {
        const fallbackSeller = marketplaceSellers.find((item) => item.id === sellerId);
        const fallbackProducts = marketplaceProducts.filter((item) => item.sellerId === sellerId);
        if (active) {
          setSeller(fallbackSeller ?? null);
          setProducts(fallbackProducts);
          if (!fallbackSeller) setError('Cardápio não encontrado.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMenu();
    return () => { active = false; };
  }, [sellerId]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category || 'Outros'))], [products]);

  const handleAdd = (product) => {
    if (!product.available || product.stock === 0 || seller.status !== 'OPEN') return;

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: location,
          intent: { type: 'add-to-cart', productId: product.id },
        },
      });
      return;
    }
    const result = addItem({ ...product, sellerId });
    if (result?.ok) toast.success(`${product.name} foi adicionado ao carrinho.`);
    else toast.error(result?.error || 'Não foi possível adicionar o produto.');
  };

  if (loading) return <div className="marketplace-page"><MarketplaceHeader /><main className="marketplace-container"><div className="marketplace-loading">Montando o cardápio de hoje...</div></main></div>;
  if (error || !seller) return <div className="marketplace-page"><MarketplaceHeader /><main className="marketplace-container"><div className="marketplace-empty"><h2>{error || 'Cardápio não encontrado.'}</h2><Link to={ROUTES.SELLERS}>Voltar para vendedores</Link></div></main></div>;

  return (
    <div className="marketplace-page">
      <MarketplaceHeader />
      <main className="marketplace-container">
        <Link className="marketplace-back" to={`${ROUTES.SELLERS}/${sellerId}`}>← {seller.name}</Link>
        <section className="menu-heading">
          <div>
            <span className="marketplace-eyebrow">Hoje no campus</span>
            <h1>O que vai salvar seu intervalo?</h1>
            <p>Escolha o que deseja e deixe o pedido encaminhado para retirar com o vendedor.</p>
          </div>
          {seller.status === 'OPEN' ? <Badge tone="success">Aceitando pedidos</Badge> : <Badge tone="neutral">Fechado agora</Badge>}
        </section>

        {products.length === 0 ? (
          <div className="marketplace-empty"><span aria-hidden="true">🍽️</span><h2>O cardápio ainda está vazio</h2><p>Volte mais tarde para conferir as opções de hoje.</p></div>
        ) : (
          categories.map((category) => (
            <section className="marketplace-section menu-category" key={category}>
              <div className="marketplace-section__heading"><h2>{category}</h2></div>
              <div className="product-grid">
                {products.filter((product) => (product.category || 'Outros') === category).map((product) => {
                  const soldOut = product.stock === 0;
                  const unavailable = product.available === false;
                  const disabled = soldOut || unavailable || seller.status !== 'OPEN';
                  return (
                    <article className={`product-card ${disabled ? 'product-card--disabled' : ''}`} key={product.id}>
                      <Link to={`${ROUTES.PRODUCT}/${product.id}`} className="product-card__visual" aria-label={`Ver ${product.name}`}>
                        <span aria-hidden="true">{product.name.slice(0, 1)}</span>
                        {soldOut ? <Badge tone="error">Esgotado</Badge> : unavailable ? <Badge tone="warning">Indisponível</Badge> : null}
                      </Link>
                      <div className="product-card__body">
                        <Link to={`${ROUTES.PRODUCT}/${product.id}`}><h3>{product.name}</h3></Link>
                        <p>{product.description}</p>
                        <div className="product-card__footer">
                          <strong>{formatCurrency(product.priceInCents)}</strong>
                          <Button size="sm" disabled={disabled} onClick={() => handleAdd(product)}>
                            {soldOut ? 'Esgotado' : unavailable ? 'Indisponível' : 'Adicionar'}
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
