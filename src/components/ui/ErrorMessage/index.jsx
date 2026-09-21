import './ErrorMessage.css';

/**
 * Bloco de erro para falhas de carregamento (ex: "Não foi possível carregar
 * o cardápio"), com ação de retry opcional. Para erro de campo de formulário,
 * use a prop `error` do próprio Input/Select — este componente é para erros
 * de operação/página.
 *
 * @param {Object} props
 * @param {string} [props.title='Não foi possível carregar o conteúdo.']
 * @param {string} [props.description]
 * @param {() => void} [props.onRetry]
 */
export function ErrorMessage({
  title = 'Não foi possível carregar o conteúdo.',
  description,
  onRetry,
}) {
  return (
    <div className="ui-error-message" role="alert">
      <span className="ui-error-message__icon" aria-hidden="true">
        ⚠
      </span>
      <div className="ui-error-message__text">
        <p className="ui-error-message__title">{title}</p>
        {description && <p>{description}</p>}
        {onRetry && (
          <button type="button" className="ui-error-message__retry" onClick={onRetry}>
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
