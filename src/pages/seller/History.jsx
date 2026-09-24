import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Card } from '../../components/ui/Card';
import './seller.css';

export function History() {
  return (
    <main className="seller-page">
      <div className="seller-container">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Vendas</span>
            <h1>Histórico</h1>
            <p>Consulte os pedidos concluídos e acompanhe o histórico da sua operação.</p>
          </div>
        </header>
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-7) var(--space-4)' }}>
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Nenhuma venda concluída</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
              As vendas concluídas aparecerão aqui depois que os primeiros pedidos forem retirados.
            </p>
            <Link className="ui-button ui-button--secondary" to={ROUTES.SELLER_ORDERS}>
              Ir para pedidos
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
