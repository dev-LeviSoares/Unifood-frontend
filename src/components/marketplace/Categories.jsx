import { Icon } from './Icon';
export const CATEGORIES = [
  { label: 'Lanches', icon: 'burger' },
  { label: 'Bebidas', icon: 'drink' },
  { label: 'Salgados', icon: 'snack' },
  { label: 'Doces', icon: 'sweet' },
];
export function Categories({ selected = '', onSelect }) {
  return (
    <div className="uf-categories" aria-label="Categorias de lanches">
      {CATEGORIES.map((category) => (
        <button
          type="button"
          key={category.label}
          className={`uf-chip${selected === category.label ? ' is-selected' : ''}`}
          aria-pressed={selected === category.label}
          onClick={() =>
            onSelect(selected === category.label ? '' : category.label)
          }
        >
          <Icon name={category.icon} size={18} />
          {category.label}
        </button>
      ))}
    </div>
  );
}
