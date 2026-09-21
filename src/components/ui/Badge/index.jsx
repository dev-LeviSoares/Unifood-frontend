import './Badge.css';

/**
 * Badge de status genérico — não sabe nada sobre pedidos ou papéis de usuário,
 * só recebe um "tone" (cor semântica) e um texto. Quem mapeia
 * ORDER_STATUS -> tone é o componente de domínio (ex: components/order/OrderStatus),
 * não este componente de UI.
 *
 * A cor nunca é o único sinal: sempre há uma bolinha (dot) + o texto, para não
 * depender só de cor (regra de acessibilidade do Design System).
 *
 * @param {Object} props
 * @param {'success'|'error'|'warning'|'neutral'} [props.tone='neutral']
 * @param {string} props.children
 */
export function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`ui-badge ui-badge--${tone}`}>
      <span className="ui-badge__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
