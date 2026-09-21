import { useId, useRef, useState } from 'react';
import '../Input/Input.css';
import './ImageUpload.css';

const DEFAULT_MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * Upload de imagem única com preview, drag-and-drop e validação de
 * tipo/tamanho. Usado em ProductForm (foto do produto) e no perfil do
 * vendedor (logo/capa).
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string|null} [props.previewUrl] - controlado pelo componente pai (ex: já vindo do backend)
 * @param {(file: File) => void} props.onChange
 * @param {() => void} [props.onRemove]
 * @param {number} [props.maxSizeMb=5]
 */
export function ImageUpload({
  label,
  previewUrl,
  onChange,
  onRemove,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  function validateAndEmit(file) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Envie uma imagem em PNG, JPEG ou WEBP.');
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`A imagem deve ter até ${maxSizeMb}MB.`);
      return;
    }
    setError('');
    onChange(file);
  }

  if (previewUrl) {
    return (
      <div className="ui-image-upload">
        {label && <label className="ui-field__label">{label}</label>}
        <div className="ui-image-upload__preview">
          <img src={previewUrl} alt="Pré-visualização da imagem enviada" />
          {onRemove && (
            <button
              type="button"
              className="ui-image-upload__remove"
              onClick={onRemove}
              aria-label="Remover imagem"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ui-image-upload">
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        className={`ui-image-upload__dropzone ${
          isDragging ? 'ui-image-upload__dropzone--dragging' : ''
        } ${error ? 'ui-image-upload__dropzone--error' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndEmit(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <span>
          Arraste uma imagem ou{' '}
          <span className="ui-image-upload__link">escolha um arquivo</span>
        </span>
        <span>PNG, JPEG ou WEBP, até {maxSizeMb}MB</span>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="ui-image-upload__input"
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
      {error && <span className="ui-field__error">⚠ {error}</span>}
    </div>
  );
}
