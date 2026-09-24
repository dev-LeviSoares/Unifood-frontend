import { useEffect, useState } from 'react';
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

export function ProductDetail() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      try {
        const data = await productService.getById(productId);
        if (active) {
          setProduct(data);
          const sellerData = await sellerService.getById(data.sellerId);
          if (active) setSeller(sellerData);
        }
      } catch {
        const fallback = marketplaceProducts.find((item) => item.id === productId);
        if (active) {
          setProduct(fallback ?? null);
          setSeller(marketplaceSellers.find((item) => item.id === fallback?.sellerId) ?? null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProduct();
    return () => { active = false; };
  }, [productId]);

  if (loading) return <div className="marketplace-page"><MarketplaceHeader /><main className="marketplace-container"><div className="marketplace-loading">Abrindo o produto...</div></main></div>;
  if (!product) return <div className="marketplace-page"><MarketplaceHeader /><main className="marketplace-container"><div className="marketplace-empty"><h2>Produto não encontrado.</h2><Link to={ROUTES.SELLERS}>Voltar para vendedores</Link></div></main></div>;

  const soldOut = product.stock === 0;
  const unavailable = product.available === false;
  const sellerClosed = seller?.status && seller.status !== 'OPEN';
  const disabled = soldOut || unavailable || sellerClosed;

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: location,
          intent: { type: 'add-to-cart', productId: product.id },
        },
      });
      return;
    }

    const result = addItem({ ...product, sellerId: product.sellerId }, quantity);
    if (result?.ok) toast.success(`${quantity}x ${product.name} foi adicionado ao carrinho.`);
    else toast.error(result?.error || 'Não foi possível adicionar o produto.');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: location,
          intent: { type: 'buy-now', productId: product.id },
        },
      });
      return;
    }

    const result = addItem({ ...product, sellerId: product.sellerId }, quantity);
    if (result?.ok) navigate(ROUTES.CART);
    else toast.error(result?.error || 'Não foi possível iniciar o pedido.');
  };

  return (
    <div className="marketplace-page">
      <MarketplaceHeader />
      <main className="marketplace-container">
        <Link className="marketplace-back" to={`${ROUTES.SELLERS}/${product.sellerId}/cardapio`}>← Voltar para o cardápio</Link>
        <section className="product-detail">
          <div className="product-detail__visual" aria-hidden="true">{product.name.slice(0, 1)}</div>
          <div className="product-detail__content">
            <span className="marketplace-eyebrow">{seller?.name || 'Vendedor'}</span>
            <h1>{product.name}</h1>
            <p className="product-detail__description">{product.description}</p>
            <strong className="product-detail__price">{formatCurrency(product.priceInCents)}</strong>
            <div className="product-detail__availability">
              {soldOut ? <Badge tone="error">Esgotado</Badge> : sellerClosed || unavailable ? <Badge tone="warning">Indisponível no momento</Badge> : <Badge tone="success">Disponível para pedido</Badge>}
              {!soldOut && product.stock > 0 && product.stock <= 5 && <span>Restam poucas unidades.</span>}
            </div>

            {!disabled && (
              <div className="product-detail__actions">
                <label className="quantity-control">
                  <span>Quantidade</span>
                  <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
                    {Array.from({ length: Math.min(product.stock, 10) }, (_, index) => index + 1).map((value) => <option value={value} key={value}>{value}</option>)}
                  </select>
                </label>
                <div className="product-detail__buttons">
                  <Button size="lg" onClick={handleAdd}>Adicionar ao carrinho</Button>
                  <Button size="lg" variant="secondary" onClick={handleBuyNow}>Comprar agora</Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
