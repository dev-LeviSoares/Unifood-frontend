import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useSellerList } from '../../hooks/useSellerList';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { menuService } from '../../services/api/menuService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import './seller.css';

export function Menus() {
  const { items: menus, loading, error, retry } = useSellerList(menuService.listBySeller, 'menus');

  return (
    <main className="seller-page">
      <div className="seller-container">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Oferta do dia</span>
            <h1>Cardápios</h1>
            <p>Defina quais produtos estarão disponíveis em cada período.</p>
          </div>
          <Link className="ui-button ui-button--primary" to={ROUTES.SELLER_MENU_NEW}>
            Novo cardápio
          </Link>
        </header>

        {loading && <Loading label="Carregando cardápios..." />}
        {!loading && error && <ErrorMessage title="Não foi possível carregar os cardápios." description="Confira a conexão com o serviço e tente novamente." onRetry={retry} />}

        {!loading && !error && menus.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: 'var(--space-7) var(--space-4)' }}>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Nenhum cardápio criado</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
                Monte seu primeiro cardápio e deixe claro para o estudante o que ele pode pedir antes de chegar ao campus.
              </p>
              <Link className="ui-button ui-button--primary" to={ROUTES.SELLER_MENU_NEW}>
                Criar cardápio
              </Link>
            </div>
          </Card>
        )}

        {!loading && !error && menus.length > 0 && (
          <div className="seller-metrics-grid">
            {menus.map((menu) => (
              <Card key={menu.id}>
                <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{menu.name}</strong>
                <span className="seller-muted">{menu.start} – {menu.end}</span>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Badge tone={menu.published ? 'success' : 'neutral'}>
                    {menu.published ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
