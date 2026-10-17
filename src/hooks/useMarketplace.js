import { useEffect, useState } from 'react';
import {
  marketplaceProducts,
  marketplaceSellers,
} from '../data/marketplaceMock';
import { productService } from '../services/api/productService';
import { sellerService } from '../services/api/sellerService';

function asItems(data) {
  const items = Array.isArray(data)
    ? data
    : (data?.items ?? data?.products ?? data?.sellers);
  // Sem backend, o servidor do Vite pode responder HTML com status 200.
  if (!Array.isArray(items)) throw new Error('Resposta de catálogo inválida.');
  return items;
}
// Um catálogo compartilhado por tela. O fallback é identificado como demonstração.
export function useMarketplace() {
  const [catalog, setCatalog] = useState({
    products: [],
    sellers: [],
    loading: true,
    demo: false,
  });
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const sellers = asItems(
          await sellerService.list({ status: 'APPROVED' }),
        ).filter((seller) =>
          seller.approvalStatus
            ? seller.approvalStatus === 'APPROVED'
            : !seller.status ||
              ['OPEN', 'CLOSED', 'APPROVED', 'ACTIVE'].includes(seller.status),
        );
        const lists = await Promise.all(
          sellers.map((seller) => productService.listBySeller(seller.id)),
        );
        if (active)
          setCatalog({
            sellers,
            products: lists.flatMap(asItems),
            loading: false,
            demo: false,
          });
      } catch {
        if (active)
          setCatalog({
            sellers: marketplaceSellers,
            products: marketplaceProducts,
            loading: false,
            demo: true,
          });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);
  return catalog;
}
