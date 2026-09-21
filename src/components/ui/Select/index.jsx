import { useId } from 'react';
import '../Input/Input.css';
import './Select.css';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {{ value: string, label: string }[]} props.options
 * @param {string} [props.placeholder]
 * @param {string} [props.error]
 * @param {string} [props.value]
 * @param {(e: React.ChangeEvent<HTMLSelectElement>) => void} [props.onChange]
 */
export function Select({ label, options, placeholder, error, id, ...rest }) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className={`ui-field ${error ? 'ui-field--error' : ''}`}>
      {label && (
        <label className="ui-field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`ui-select ${error ? 'ui-select--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? messageId : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={messageId} className="ui-field__error">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
