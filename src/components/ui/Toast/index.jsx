import './Toast.css';

/**
 * Renderizado uma única vez pelo ToastProvider (contexts/ToastContext.jsx).
 * Para disparar um toast de qualquer componente, use o hook `useToast()`:
 *
 *   const toast = useToast();
 *   toast.success('Pedido enviado!');
 *   toast.error('Não foi possível salvar.');
 *
 * @param {Object} props
 * @param {{ id: number, message: string, tone: string }[]} props.toasts
 * @param {(id: number) => void} props.onDismiss
 */
export function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="ui-toast-viewport" role="region" aria-label="Notificações">
      {toasts.map((toast) => (
        <div key={toast.id} className={`ui-toast ui-toast--${toast.tone}`} role="status">
          <span>{toast.message}</span>
          <button
            type="button"
            className="ui-toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
