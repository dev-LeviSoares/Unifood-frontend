import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

/**
 * O estado do carrinho e o hook que o lê moram no mesmo arquivo de propósito:
 * antes existiam hooks/useCart.js e contexts/CartContext.jsx separados, com dois
 * "donos" possíveis do mesmo estado. Consolidado aqui, só há uma fonte de verdade.
 */
export function CartProvider({ children }) {
  const [sellerId, setSellerId] = useState(null);
  const [items, setItems] = useState([]); // { productId, name, unitPriceInCents, quantity }

  const addItem = useCallback((product, quantity = 1) => {
    if (!product?.sellerId || !product?.id || quantity < 1) {
      return { ok: false, error: 'Produto inválido para o carrinho.' };
    }

    if (sellerId && sellerId !== product.sellerId) {
      return {
        ok: false,
        error: 'Seu carrinho só pode ter produtos de um vendedor por vez.',
      };
    }

    if (product.available === false || product.stock === 0) {
      return { ok: false, error: 'Este produto não está disponível para pedido.' };
    }

    const currentItem = items.find((item) => item.productId === product.id);
    const nextQuantity = (currentItem?.quantity ?? 0) + quantity;

    if (Number.isFinite(product.stock) && nextQuantity > product.stock) {
      return { ok: false, error: `Há apenas ${product.stock} unidade(s) disponíveis.` };
    }

    setSellerId((current) => current ?? product.sellerId);
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          unitPriceInCents: product.priceInCents,
          quantity,
        },
      ];
    });

    return { ok: true };
  }, [items, sellerId]);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setSellerId(null);
  }, []);

  const totalInCents = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPriceInCents * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ sellerId, items, addItem, removeItem, updateQuantity, clear, totalInCents }),
    [sellerId, items, addItem, removeItem, updateQuantity, clear, totalInCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart precisa ser usado dentro de um CartProvider');
  }
  return context;
}
