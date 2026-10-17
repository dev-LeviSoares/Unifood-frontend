import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../../services/api/productService';
import { sellerService } from '../../../services/api/sellerService';
import {
  marketplaceProducts,
  marketplaceSellers,
} from '../../../data/marketplaceMock';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../contexts/ToastContext';
import { favorites } from '../../../services/storage/favorites';
import { useProductActions } from '../../../hooks/useProductActions';
import { useCart } from '../../../contexts/CartContext';
import { formatCurrency } from '../../../utils/formatCurrency';
import { StudentPage } from '../StudentPage';
import { QuantityControl } from '../../../components/marketplace/QuantityControl';
import { Icon } from '../../../components/marketplace/Icon';

export function ProductDetail() {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [favoriteRevision, setFavoriteRevision] = useState(0);
  const favorite = user && favorites.list(user.id).includes(productId);
  function toggleFavorite() {
    if (!user) {
      navigate(ROUTES.LOGIN, {
        state: { from: { pathname: `${ROUTES.PRODUCT}/${productId}` } },
      });
      return;
    }
    try {
      favorites.toggle(user.id, productId);
      setFavoriteRevision(favoriteRevision + 1);
    } catch {
      toast.error('Não foi possível salvar o favorito.');
    }
  }
  const { add } = useProductActions();
  const { items } = useCart();
  const [data, setData] = useState({
    loading: true,
    product: null,
    seller: null,
    demo: false,
  });
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  useEffect(() => {
    let active = true;
    setData({ loading: true, product: null, seller: null, demo: false });
    setQuantity(1);
    setNote('');
    async function load() {
      try {
        const product = await productService.getById(productId);
        if (!product || typeof product !== 'object' || !product.id)
          throw new Error('Resposta de produto inválida.');
        const seller = await sellerService.getById(product.sellerId);
        if (active) setData({ loading: false, product, seller, demo: false });
      } catch {
        const product = marketplaceProducts.find(
          (item) => item.id === productId,
        );
        if (active)
          setData({
            loading: false,
            product,
            seller: marketplaceSellers.find(
              (item) => item.id === product?.sellerId,
            ),
            demo: true,
          });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [productId]);
  const { product, seller, loading, demo } = data;
  const current = items.find((item) => item.productId === productId);
  const max = Math.max(0, (product?.stock ?? 99) - (current?.quantity ?? 0));
  const unavailable =
    !product ||
    product.available === false ||
    product.stock === 0 ||
    seller?.status === 'CLOSED' ||
    max === 0;
  return (
    <StudentPage title="Detalhe do produto" cartBar>
      {loading ? (
        <div className="uf-skeleton uf-skeleton--detail" role="status">
          Abrindo o produto...
        </div>
      ) : !product ? (
        <div className="uf-empty">
          <h1>Produto não encontrado</h1>
          <Link className="uf-button" to={ROUTES.SELLERS}>
            Voltar para a busca
          </Link>
        </div>
      ) : (
        <>
          <Link
            className="uf-back"
            to={`${ROUTES.SELLERS}/${product.sellerId}/cardapio`}
          >
            <Icon name="arrow" size={18} />
            Voltar para o cardápio
          </Link>
          <section className="uf-detail-layout">
            <div className="uf-detail-photo">
              <img
                src={product.imageUrl || '/images/food/burger.webp'}
                alt={product.name}
              />
              {demo && <span className="uf-photo-tag">Catálogo demo</span>}
              <button
                className={`uf-favorite${favorite ? ' is-selected' : ''}`}
                aria-label={
                  favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'
                }
                aria-pressed={Boolean(favorite)}
                onClick={toggleFavorite}
              >
                <Icon name="heart" />
              </button>
            </div>
            <div className="uf-detail-content">
              <span className={`uf-tag${unavailable ? ' uf-tag--muted' : ''}`}>
                {product.stock === 0
                  ? 'Esgotado hoje'
                  : unavailable
                    ? 'Indisponível agora'
                    : 'Disponível agora'}
              </span>
              <div className="uf-detail-title">
                <h1>{product.name}</h1>
                <strong>{formatCurrency(product.priceInCents)}</strong>
              </div>
              <p>{product.description}</p>
              <Link
                className="uf-seller-link"
                to={`${ROUTES.SELLERS}/${product.sellerId}`}
              >
                <span className="uf-seller-avatar">
                  {seller?.name?.slice(0, 1) || 'V'}
                </span>
                <span>
                  <strong>{seller?.name || 'Ver vendedor'}</strong>
                  <small>Conheça quem prepara seu lanche</small>
                </span>
                <Icon name="chevron" size={18} />
              </Link>
              <section className="uf-pickup-inline">
                <Icon name="pin" />
                <div>
                  <h2>Retire com o vendedor</h2>
                  <p>{seller?.pickupPoint || 'Ponto a combinar no campus'}</p>
                  <small>
                    {seller?.pickupTime || 'Confirme o horário com o vendedor'}{' '}
                    · Sem taxa de entrega
                  </small>
                </div>
              </section>
              <p className="uf-allergy">
                <Icon name="shield" size={18} />
                {product.allergens ||
                  'Consulte o vendedor sobre ingredientes e alergênicos antes de pedir.'}
              </p>
              <label className="uf-field">
                <strong>Algum pedido especial?</strong>
                <textarea
                  maxLength={140}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ex.: sem maionese, por favor."
                />
                <small>Opcional · {note.length}/140</small>
              </label>
              {current && (
                <div className="uf-notice">
                  <Icon name="bag" size={20} />
                  <span>
                    {current.quantity}× {product.name} no seu carrinho
                  </span>
                  <Link to={ROUTES.CART}>Ver carrinho</Link>
                </div>
              )}
              <div className="uf-detail-actions">
                <QuantityControl
                  value={quantity}
                  onChange={setQuantity}
                  max={max}
                  name={product.name}
                />
                <button
                  className="uf-button"
                  disabled={unavailable || quantity > max}
                  onClick={() => add(product, quantity, false, note)}
                >
                  {unavailable
                    ? product.stock === 0
                      ? 'Esgotado por hoje'
                      : 'Indisponível agora'
                    : `Adicionar · ${formatCurrency(product.priceInCents * quantity)}`}
                </button>
              </div>
              <button
                className="uf-text-button uf-buy-now"
                disabled={unavailable || quantity > max}
                onClick={() => add(product, quantity, true, note)}
              >
                Comprar agora
              </button>
            </div>
          </section>
        </>
      )}
    </StudentPage>
  );
}
