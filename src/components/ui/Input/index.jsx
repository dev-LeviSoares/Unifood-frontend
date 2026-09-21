import { useId } from 'react';
import './Input.css';

/**
 * Campo de texto com label, mensagem de ajuda e erro de validação —
 * segue as regras do Design System: mensagem próxima ao campo, linguagem
 * simples, indicação visual que não depende só de cor.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.error] - mensagem de erro; quando presente, sobrepõe helperText/successText
 * @param {string} [props.successText]
 * @param {string} [props.helperText]
 * @param {string} [props.value]
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange]
 */
export function Input({
  label,
  error,
  successText,
  helperText,
  id,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className={`ui-field ${error ? 'ui-field--error' : ''}`}>
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="ui-field__input"
        aria-invalid={!!error}
        aria-describedby={error || successText || helperText ? messageId : undefined}
        {...rest}
      />
      {error && (
        <span id={messageId} className="ui-field__error">
          ⚠ {error}
        </span>
      )}
      {!error && successText && (
        <span id={messageId} className="ui-field__success">
          ✓ {successText}
        </span>
      )}
      {!error && !successText && helperText && (
        <span id={messageId} className="ui-field__helper">
          {helperText}
        </span>
      )}
    </div>
  );
}
