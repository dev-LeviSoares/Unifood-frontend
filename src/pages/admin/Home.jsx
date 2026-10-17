import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { adminSections } from './adminPreview';
import './admin.css';

export function Home() {
  const { user } = useAuth();
  const sections = Object.values(adminSections);

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-page-header">
          <div>
            <span className="admin-eyebrow">Visão da plataforma</span>
            <h1>Olá, {user?.name?.split(' ')[0] || 'administrador'}.</h1>
            <p>Seu campus em um só lugar. Explore as áreas e acompanhe a operação.</p>
          </div>
          <Link className="admin-outline-action" to={ROUTES.HOME}>
            Ver marketplace →
          </Link>
        </header>

        <p className="operations-notice">
          Demonstração visual: os indicadores e registros abaixo são fictícios.
          A gestão real depende da integração administrativa.
        </p>

        <section className="admin-metrics-grid" aria-label="Indicadores de demonstração">
          {sections.map((section) => (
            <Link to={section.path} className="admin-metric" key={section.path}>
              <span>{section.title}</span>
              <strong>{section.rows.length}</strong>
              <small>Registros de exemplo →</small>
            </Link>
          ))}
        </section>

        <section className="admin-attention-grid">
          <article className="admin-panel">
            <span className="admin-eyebrow">Acesso rápido</span>
            <h2>O que você quer acompanhar?</h2>
            <div className="operations-shortcuts">
              {sections.map((section) => (
                <Link key={section.path} to={section.path}>
                  <div>
                    <strong>{section.title}</strong>
                    <p>{section.description}</p>
                  </div>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="admin-panel admin-panel--guide">
            <span className="admin-eyebrow">Unifood no campus</span>
            <h2>Uma pausa mais gostosa para todo mundo.</h2>
            <p>
              Consulte vendedores e produtos e confira como os estudantes
              encontram seus lanches.
            </p>
            <Link className="admin-outline-action" to={ROUTES.SELLERS}>
              Explorar catálogo →
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}
