import { marketplaceProducts, marketplaceSellers } from '../../data/marketplaceMock';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';

// Synthetic preview only. This is not an administrative API or a list of real accounts.
export const adminSections = {
  users: {
    title: 'Usuários',
    path: ROUTES.ADMIN_USERS,
    description: 'Consulte os perfis e seus tipos de acesso.',
    rows: [{
      id: 'aluno-exemplo',
      name: 'Estudante de exemplo',
      status: 'Estudante',
      detail: 'Conta fictícia para conferir a interface.'
    }, {
      id: 'vendedor-exemplo',
      name: 'Vendedor de exemplo',
      status: 'Vendedor',
      detail: 'Conta fictícia para conferir a interface.'
    }]
  },
  sellers: {
    title: 'Vendedores',
    path: ROUTES.ADMIN_SELLERS,
    description: 'Explore os estabelecimentos do campus.',
    rows: marketplaceSellers.map(seller => ({
      id: seller.id,
      name: seller.name,
      status: seller.status === 'OPEN' ? 'Aberto' : 'Fechado',
      detail: seller.description,
      image: seller.coverImage,
      href: `${ROUTES.SELLERS}/${seller.id}`,
      linkLabel: 'Ver página pública'
    }))
  },
  products: {
    title: 'Produtos',
    path: ROUTES.ADMIN_PRODUCTS,
    description: 'Consulte os itens e a disponibilidade do catálogo.',
    rows: marketplaceProducts.map(product => ({
      id: product.id,
      name: product.name,
      status: product.stock === 0 ? 'Esgotado' : product.available ? 'Disponível' : 'Pausado',
      detail: `${product.description} • ${formatCurrency(product.priceInCents)} • Estoque: ${product.stock}`,
      image: product.imageUrl,
      href: `${ROUTES.PRODUCT}/${product.id}`,
      linkLabel: 'Ver produto'
    }))
  },
  orders: {
    title: 'Pedidos',
    path: ROUTES.ADMIN_ORDERS,
    description: 'Acompanhe o resumo dos pedidos e suas etapas.',
    rows: [{
      id: 'exemplo-001',
      name: 'Pedido de exemplo #001',
      status: 'Em preparo',
      detail: '1 × X-Burguer da Casa • R$ 14,90 • Cantinho da Maria. Pedido fictício, sem cobrança.'
    }, {
      id: 'exemplo-002',
      name: 'Pedido de exemplo #002',
      status: 'Concluído',
      detail: '1 × Coxinha de Frango • R$ 6,50 • Cantinho da Maria. Pedido fictício, sem cobrança.'
    }]
  }
};
