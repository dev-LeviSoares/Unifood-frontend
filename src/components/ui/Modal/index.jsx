import { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal base (bottom-sheet no mobile, centralizado a partir de tablet).
 * Fecha com Esc ou clique no overlay; foco vai para o modal ao abrir.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.footer]
 * @param {React.ReactNode} props.children
 */
export function Modal({ open, onClose, title, footer, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="ui-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'ui-modal-title' : undefined}
        tabIndex={-1}
        ref={modalRef}
      >
        {title && (
          <div className="ui-modal__header">
            <h3 id="ui-modal-title" className="ui-modal__title">
              {title}
            </h3>
            <button
              type="button"
              className="ui-modal__close"
              onClick={onClose}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        )}
        {children}
        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
