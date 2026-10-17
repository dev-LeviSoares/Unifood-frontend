import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '../hooks/useAuth';
import { readLocalData, writeLocalData } from '../services/storage/localData';

const CartContext = createContext(null);
const emptyCart = { sellerId: null, items: [] };
function readCart(key) {
  const cart = readLocalData(key, emptyCart);
  if (!cart || !Array.isArray(cart.items)) return emptyCart;
  const items = cart.items.filter(
    (item) =>
      item &&
      typeof item.productId === 'string' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      Number.isInteger(item.unitPriceInCents) &&
      item.unitPriceInCents >= 0,
  );
  return cart.sellerId && items.length
    ? { sellerId: cart.sellerId, items }
    : emptyCart;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = `unifood_cart:${user?.id ?? 'guest'}`;
  const [stored, setStored] = useState(() => ({ key, cart: readCart(key) }));
  // Trocar de conta nunca reaproveita o carrinho do estudante anterior.
  const cart = stored.key === key ? stored.cart : readCart(key);
  const { sellerId, items } = cart;
  const commit = useCallback(
    (next) => {
      writeLocalData(key, next);
      setStored({ key, cart: next });
    },
    [key],
  );

  useEffect(() => {
    function sync(event) {
      if (event.key === key) setStored({ key, cart: readCart(key) });
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key]);

  const addItem = useCallback(
    (product, quantity = 1) => {
      const { sellerId, items } = readCart(key);
      if (
        !product?.id ||
        !product.sellerId ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isInteger(product.priceInCents) ||
        product.priceInCents < 0
      )
        return { ok: false, error: 'Produto ou quantidade inválida.' };
      if (sellerId && sellerId !== product.sellerId)
        return {
          ok: false,
          error: 'Seu carrinho só pode ter produtos de um vendedor por vez.',
        };
      const existing = items.find((item) => item.productId === product.id);
      const nextQuantity = (existing?.quantity ?? 0) + quantity;
      if (product.available === false || product.stock === 0)
        return { ok: false, error: 'Este produto não está disponível.' };
      if (Number.isFinite(product.stock) && nextQuantity > product.stock)
        return {
          ok: false,
          error: `Há apenas ${product.stock} unidade(s) disponíveis.`,
        };
      const newItem = {
        productId: product.id,
        name: product.name,
        unitPriceInCents: product.priceInCents,
        quantity: nextQuantity,
        stock: product.stock,
        imageUrl: product.imageUrl,
        note: product.note ?? existing?.note ?? '',
      };
      try {
        commit({
          sellerId: product.sellerId,
          items: existing
            ? items.map((item) =>
                item.productId === product.id ? newItem : item,
              )
            : [...items, newItem],
        });
        return { ok: true };
      } catch {
        return {
          ok: false,
          error: 'Não foi possível salvar o carrinho neste navegador.',
        };
      }
    },
    [key, commit],
  );

  const removeItem = useCallback(
    (productId) => {
      const next = items.filter((item) => item.productId !== productId);
      commit({ sellerId: next.length ? sellerId : null, items: next });
    },
    [items, sellerId, commit],
  );
  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (!Number.isInteger(quantity) || quantity < 1) return;
      commit({
        sellerId,
        items: items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, item.stock ?? quantity) }
            : item,
        ),
      });
    },
    [items, sellerId, commit],
  );
  const clear = useCallback(() => commit(emptyCart), [commit]);
  const totalInCents = items.reduce(
    (total, item) => total + item.quantity * item.unitPriceInCents,
    0,
  );
  const value = useMemo(
    () => ({
      sellerId,
      items,
      totalInCents,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [sellerId, items, totalInCents, addItem, removeItem, updateQuantity, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart precisa de CartProvider.');
  return context;
}
