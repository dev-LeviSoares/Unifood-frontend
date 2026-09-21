import './Loading.css';

/**
 * Spinner para carregamentos que não têm um layout final conhecido
 * (ex: submissão, troca de página inteira). Para listas e conteúdo
 * estruturado, prefira components/ui/Skeleton.
 *
 * @param {Object} props
 * @param {string} [props.label='Carregando...']
 * @param {boolean} [props.fullscreen=false]
 */
export function Loading({ label = 'Carregando...', fullscreen = false }) {
  const content = (
    <span className="ui-loading" role="status" aria-live="polite">
      <span className="ui-loading__spinner" aria-hidden="true" />
      {label}
    </span>
  );

  if (!fullscreen) return content;

  return <div className="ui-loading--fullscreen">{content}</div>;
}
