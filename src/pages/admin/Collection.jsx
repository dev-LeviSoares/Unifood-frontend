import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { adminSections } from './adminPreview';
import './admin.css';

function RecordCard({ row, detailUrl }) {
  return (
    <article className="admin-panel operations-record">
      {row.image && <img src={row.image} alt="" />}
      <div>
        <span className="operations-tag">{row.status}</span>
        <h2>{row.name}</h2>
        <p>{row.detail}</p>
        <Link className="operations-record-link" to={detailUrl}>
          Ver detalhes →
          <span className="operations-sr-only"> {row.name}</span>
        </Link>
      </div>
    </article>
  );
}

function RecordDetail({ row, listUrl }) {
  return (
    <section className="admin-panel operations-detail" aria-label="Detalhes do registro">
      <Link className="operations-back" to={listUrl}>← Voltar à lista</Link>
      {row ? (
        <>
          <span className="operations-tag">{row.status}</span>
          <h2>{row.name}</h2>
          <p>{row.detail}</p>
          {row.href && (
            <Link className="admin-outline-action" to={row.href}>
              {row.linkLabel} →
            </Link>
          )}
        </>
      ) : (
        <>
          <h2>Registro não encontrado</h2>
          <p>Escolha um dos registros da lista para continuar.</p>
        </>
      )}
    </section>
  );
}

export function AdminCollection({ resource }) {
  const section = adminSections[resource];
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const selected = section.rows.find((row) => row.id === params.get('item'));
  const rows = section.rows.filter((row) =>
    `${row.name} ${row.status}`.toLocaleLowerCase('pt-BR')
      .includes(query.toLocaleLowerCase('pt-BR')),
  );

  function search(value) {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);
    else next.delete('q');
    next.delete('item');
    setParams(next, { replace: true });
  }

  // A seleção faz parte da URL: recarga, voltar e avançar preservam a tela.
  function detailUrl(id) {
    const next = new URLSearchParams(params);
    if (id) next.set('item', id);
    else next.delete('item');
    return `?${next}`;
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-page-header">
          <div>
            <Link className="operations-back" to={ROUTES.ADMIN_HOME}>← Visão geral</Link>
            <span className="admin-eyebrow">Administração</span>
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </div>
          <Link className="admin-outline-action" to={ROUTES.HOME}>Ver marketplace →</Link>
        </header>

        <p className="operations-notice">
          Demonstração visual: dados fictícios para teste.
          Nenhuma alteração é enviada à plataforma.
        </p>

        <div className="operations-toolbar">
          <label className="ui-field">
            <span className="ui-field__label">Buscar em {section.title.toLowerCase()}</span>
            <input
              className="ui-field__input"
              type="search"
              value={query}
              onChange={(event) => search(event.target.value)}
              placeholder="Nome ou status"
            />
          </label>
          <p aria-live="polite">{rows.length} registro(s)</p>
        </div>

        {params.has('item') && <RecordDetail row={selected} listUrl={detailUrl()} />}

        <section className="operations-records" aria-label={`Lista de ${section.title.toLowerCase()}`}>
          {rows.map((row) => (
            <RecordCard key={row.id} row={row} detailUrl={detailUrl(row.id)} />
          ))}
          {!rows.length && (
            <div className="admin-panel operations-empty">
              <h2>Nenhum resultado</h2>
              <p>Tente outro nome ou limpe a busca.</p>
              <button type="button" className="admin-outline-action" onClick={() => search('')}>
                Limpar busca
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
