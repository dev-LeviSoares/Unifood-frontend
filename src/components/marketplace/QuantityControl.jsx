import { Icon } from './Icon';
export function QuantityControl({
  value,
  onChange,
  max = 99,
  min = 1,
  name = 'produto',
}) {
  return (
    <div
      className="uf-quantity"
      role="group"
      aria-label={`Quantidade de ${name}`}
    >
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label={`Diminuir quantidade de ${name}`}
      >
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Aumentar quantidade de ${name}`}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
