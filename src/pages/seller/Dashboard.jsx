import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import './seller.css';

const metrics = [
  { key: 'pending', label: 'Pedidos pendentes', value: '0', tone: 'warning', href: ROUTES.SELLER_ORDERS },
  { key: 'preparing', label: 'Em preparação', value: '0', tone: 'info', href: ROUTES.SELLER_ORDERS },
  { key: 'ready', label: 'Pedidos prontos', value: '0', tone: 'success', href: ROUTES.SELLER_ORDERS },
  { key: 'completed', label: 'Vendas concluídas', value: '0', tone: 'neutral', href: ROUTES.SELLER_HISTORY },
  { key: 'active', label: 'Produtos ativos', value: '0', tone: 'info', href: ROUTES.SELLER_PRODUCTS },
  { key: 'soldOut', label: 'Produtos esgotados', value: '0', tone: 'danger', href: ROUTES.SELLER_PRODUCTS },
];

const statusCopy = {
  pending: { label: 'Cadastro em análise', description: 'Seu cadastro precisa ser aprovado pelo administrador antes de publicar produtos e receber pedidos.', tone: 'warning' },
  approved: { label: 'Aprovado', description: 'Sua conta está apta a publicar produtos e operar pedidos.', tone: 'success' },
  active: { label: 'Aprovado', description: 'Sua conta está apta a publicar produtos e operar pedidos.', tone: 'success' },
  rejected: { label: 'Cadastro recusado', description: 'Consulte a equipe responsável para saber os próximos passos.', tone: 'error' },
  blocked: { label: 'Conta bloqueada', description: 'Sua operação está bloqueada. Consulte a equipe responsável.', tone: 'error' },
};

export function Dashboard() {
  const { user } = useAuth();
  const status = statusCopy[user?.status?.toLowerCase()] || statusCopy.pending;
  const establishmentName = user?.establishmentName || 'Seu estabelecimento';

  return (
    <main className="seller-page">
      <div className="seller-container">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Painel do vendedor</span>
            <h1>Olá, {user?.name?.split(' ')[0] || 'vendedor'}.</h1>
            <p>Acompanhe sua operação e mantenha o cardápio pronto para os intervalos da universidade.</p>
          </div>
          <Link className="ui-button ui-button--primary" to={ROUTES.SELLER_PRODUCT_NEW}>
            Novo produto
          </Link>
        </header>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Badge tone={status.tone === 'error' ? 'error' : status.tone}>{status.tone === 'success' ? '✓ Aprovado' : status.label}</Badge>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-small)' }}>{status.description}</p>
            </div>
            <Link to={ROUTES.SELLER_PROFILE} style={{ color: 'var(--color-primary-dark)', fontWeight: 600, fontSize: 'var(--fs-small)' }}>
              Ver perfil
            </Link>
          </div>
        </Card>

        <section className="seller-section">
          <div className="seller-section-heading">
            <div>
              <span className="seller-eyebrow">Visão geral</span>
              <h2>Movimento do seu negócio</h2>
            </div>
            <span className="seller-muted">{establishmentName}</span>
          </div>
          <div className="seller-metrics-grid">
            {metrics.map((metric) => (
              <Link className="seller-metric-link" to={metric.href} key={metric.key}>
                <Card>
                  <span className={`seller-metric-dot ${metric.tone}`} />
                  <span className="seller-metric-label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                </Card>
              </Link>
            ))}
          </div>
          <p className="seller-data-note" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-caption)', marginTop: 'var(--space-3)' }}>
            Os indicadores serão alimentados pelos pedidos e produtos da sua conta quando a API estiver conectada.
          </p>
        </section>

        <section className="seller-quick-grid">
          <Link className="seller-card-link" to={ROUTES.SELLER_PRODUCTS}>
            <Card>
              <span className="seller-eyebrow">Produtos</span>
              <strong style={{ display: 'block', fontSize: 'var(--fs-h3)', margin: 'var(--space-2) 0' }}>Organize seu catálogo</strong>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-small)' }}>Cadastre produtos, ajuste preço, estoque e disponibilidade.</p>
            </Card>
          </Link>
          <Link className="seller-card-link" to={ROUTES.SELLER_MENUS}>
            <Card>
              <span className="seller-eyebrow">Cardápios</span>
              <strong style={{ display: 'block', fontSize: 'var(--fs-h3)', margin: 'var(--space-2) 0' }}>Monte o cardápio de hoje</strong>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-small)' }}>Escolha o que estará disponível para os estudantes.</p>
            </Card>
          </Link>
          <Link className="seller-card-link" to={ROUTES.SELLER_ORDERS}>
            <Card>
              <span className="seller-eyebrow">Pedidos</span>
              <strong style={{ display: 'block', fontSize: 'var(--fs-h3)', margin: 'var(--space-2) 0' }}>Acompanhe as retiradas</strong>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-small)' }}>Veja pedidos e avance cada etapa da preparação.</p>
            </Card>
          </Link>
        </section>
      </div>
    </main>
  );
}
