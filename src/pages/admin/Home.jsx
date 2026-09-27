import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import './admin.css';

const metrics = [
  ['Estudantes', '0', 'Contas cadastradas'],
  ['Vendedores', '0', 'Contas aprovadas'],
  ['Produtos', '0', 'Itens publicados'],
  ['Pedidos', '0', 'Pedidos registrados'],
];

export function Home() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'administrador';

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-page-header">
          <div>
            <span className="admin-eyebrow">Visão da plataforma</span>
            <h1>Olá, {firstName}.</h1>
            <p>Acompanhe o que está acontecendo no Unifood e encontre rapidamente o que precisa de atenção.</p>
          </div>
          <Link className="admin-outline-action" to={ROUTES.HOME}>Ver marketplace <span>→</span></Link>
        </header>

        <section className="admin-metrics-grid" aria-label="Indicadores da plataforma">
          {metrics.map(([label, value, hint]) => (
            <article className="admin-metric" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{hint}</small>
            </article>
          ))}
        </section>

        <section className="admin-attention-grid">
          <article className="admin-panel admin-panel--attention">
            <div className="admin-panel-heading"><div><span>Precisa de atenção</span><h2>O que acompanhar</h2></div><span className="admin-panel-dot" /></div>
            <div className="admin-attention-list">
              <div><span className="admin-attention-icon admin-attention-icon--warning">!</span><div><strong>Vendedores pendentes</strong><p>Novos cadastros aparecerão aqui para aprovação.</p></div><b>—</b></div>
              <div><span className="admin-attention-icon admin-attention-icon--neutral">◷</span><div><strong>Pedidos em andamento</strong><p>Acompanhe a operação quando os primeiros pedidos chegarem.</p></div><b>—</b></div>
              <div><span className="admin-attention-icon admin-attention-icon--success">✓</span><div><strong>Produtos publicados</strong><p>O catálogo será alimentado pelos vendedores aprovados.</p></div><b>—</b></div>
            </div>
          </article>

          <article className="admin-panel admin-panel--guide">
            <span className="admin-eyebrow">Próximos passos</span>
            <h2>Tenha a visão do campus em um só lugar.</h2>
            <p>Quando a API estiver conectada, esta área reunirá os indicadores reais da plataforma sem perder a simplicidade.</p>
            <div className="admin-guide-steps"><span>01 <b>Usuários</b></span><span>02 <b>Vendedores</b></span><span>03 <b>Pedidos</b></span></div>
          </article>
        </section>

        <section className="admin-panel admin-panel--quick">
          <div className="admin-panel-heading"><div><span>Acesso rápido</span><h2>Áreas administrativas</h2></div></div>
          <div className="admin-quick-grid">
            {['Usuários','Vendedores','Produtos','Pedidos'].map((item) => <div className="admin-quick-item" key={item}><span>{item.slice(0,1)}</span><div><strong>{item}</strong><small>Área preparada para integração</small></div><b>→</b></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}
