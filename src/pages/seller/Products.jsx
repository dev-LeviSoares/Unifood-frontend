import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/api/productService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Loading } from '../../components/ui/Loading';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { formatCurrency } from '../../utils/formatCurrency';
import './seller.css';

const columns = [
  { key: 'name', header: 'Produto' },
  {
    key: 'priceInCents',
    header: 'Preço',
    render: (row) => formatCurrency(row.priceInCents),
  },
  { key: 'stock', header: 'Estoque' },
  {
    key: 'available',
    header: 'Status',
    render: (row) =>
      row.stock === 0 ? (
        <Badge tone="error">Esgotado</Badge>
      ) : row.available === false ? (
        <Badge tone="neutral">Pausado</Badge>
      ) : (
        <Badge tone="success">Disponível</Badge>
      ),
  },
  {
    key: 'actions',
    header: '',
    render: (row) => (
      <Link to={ROUTES.SELLER_PRODUCT_EDIT.replace(':productId', row.id)}>Editar</Link>
    ),
  },
];

export function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await productService.listBySeller(user?.id);
      setProducts(data ?? []);
    } catch {
      // sem backend ainda: trata como "nenhum produto" em vez de travar a tela
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <main className="seller-page">
      <div className="seller-container">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Catálogo</span>
            <h1>Produtos</h1>
            <p>Gerencie os itens que aparecem no seu cardápio.</p>
          </div>
          <Link className="ui-button ui-button--primary" to={ROUTES.SELLER_PRODUCT_NEW}>
            Novo produto
          </Link>
        </header>

        {loading && <Loading label="Carregando produtos..." />}

        {!loading && error && (
          <ErrorMessage title="Não foi possível carregar seus produtos." onRetry={load} />
        )}

        {!loading && !error && products.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: 'var(--space-7) var(--space-4)' }}>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Nenhum produto cadastrado</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
                Comece adicionando os produtos que os estudantes poderão encontrar no seu estabelecimento.
              </p>
              <Link className="ui-button ui-button--primary" to={ROUTES.SELLER_PRODUCT_NEW}>
                Cadastrar produto
              </Link>
            </div>
          </Card>
        )}

        {!loading && !error && products.length > 0 && (
          <Table columns={columns} rows={products} />
        )}
      </div>
    </main>
  );
}
