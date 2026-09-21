import './Card.css';

/**
 * Container base para produtos, pedidos, cards de dashboard etc.
 * @param {Object} props
 * @param {React.ReactNode} [props.header]
 * @param {React.ReactNode} [props.footer]
 * @param {boolean} [props.flush=false] - remove o padding interno, útil quando o
 *   conteúdo (ex: uma imagem) precisa ir até a borda do card.
 */
export function Card({ header, footer, flush = false, children, ...rest }) {
  return (
    <div className={`ui-card ${flush ? 'ui-card--flush' : ''}`} {...rest}>
      {header && <div className="ui-card__header">{header}</div>}
      {children}
      {footer && <div className="ui-card__footer">{footer}</div>}
    </div>
  );
}
