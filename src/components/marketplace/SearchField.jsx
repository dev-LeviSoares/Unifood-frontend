import { useState } from 'react';
import { Icon } from './Icon';
export function SearchField({
  value = '',
  onSearch,
  label = 'Buscar por lanches',
  placeholder = 'Busque por lanches...',
}) {
  const [draft, setDraft] = useState(value);
  // A chave no componente pai acompanha o valor da URL ao voltar/avançar.
  return (
    <form
      className="uf-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(draft);
      }}
    >
      <button type="submit" aria-label="Buscar">
        <Icon name="search" size={20} />
      </button>
      <input
        aria-label={label}
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
      />
      {draft && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => {
            setDraft('');
            onSearch('');
          }}
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </form>
  );
}
