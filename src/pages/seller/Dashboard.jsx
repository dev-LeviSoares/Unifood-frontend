import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
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
  rejected: { label: 'Cadastro recusado', description: 'Consulte a equipe responsável para saber os próximos passos.', tone: 'danger' },
  blocked: { label: 'Conta bloqueada', description: 'Sua operação está bloqueada. Consulte a equipe responsável.', tone: 'danger' },
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
          <Link className="seller-primary-button" to={ROUTES.SELLER_PRODUCT_NEW}>Novo produto</Link>
        </header>

        <section className={`seller-status-card ${status.tone}`} aria-label="Status de aprovação">
          <div className="seller-status-icon">{status.tone === 'success' ? '✓' : '!'}</div>
          <div>
            <span className="seller-status-label">Status da conta</span>
            <h2>{status.label}</h2>
            <p>{status.description}</p>
          </div>
          <Link to={ROUTES.SELLER_PROFILE}>Ver perfil</Link>
        </section>

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
              <Link className="seller-metric-card" to={metric.href} key={metric.key}>
                <span className={`seller-metric-dot ${metric.tone}`} />
                <span className="seller-metric-label">{metric.label}</span>
                <strong>{metric.value}</strong>
                <span className="seller-metric-link">Acessar →</span>
              </Link>
            ))}
          </div>
          <p className="seller-data-note">Os indicadores serão alimentados pelos pedidos e produtos da sua conta quando a API estiver conectada.</p>
        </section>

        <section className="seller-quick-grid">
          <Link className="seller-action-card" to={ROUTES.SELLER_PRODUCTS}>
            <span>Produtos</span>
            <strong>Organize seu catálogo</strong>
            <p>Cadastre produtos, ajuste preço, estoque e disponibilidade.</p>
            <span className="seller-card-arrow">→</span>
          </Link>
          <Link className="seller-action-card" to={ROUTES.SELLER_MENUS}>
            <span>Cardápios</span>
            <strong>Monte o cardápio de hoje</strong>
            <p>Escolha o que estará disponível para os estudantes.</p>
            <span className="seller-card-arrow">→</span>
          </Link>
          <Link className="seller-action-card" to={ROUTES.SELLER_ORDERS}>
            <span>Pedidos</span>
            <strong>Acompanhe as retiradas</strong>
            <p>Veja pedidos e avance cada etapa da preparação.</p>
            <span className="seller-card-arrow">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
