import './Pagination.css';

function getPageList(current, total) {
  // sempre mostra primeira, última, a atual e uma vizinha de cada lado;
  // o resto vira "..." — evita uma lista de 40 botões em telas pequenas.
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

/**
 * @param {Object} props
 * @param {number} props.currentPage - 1-indexado
 * @param {number} props.totalPages
 * @param {(page: number) => void} props.onPageChange
 */
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageList(currentPage, totalPages);

  return (
    <nav className="ui-pagination" aria-label="Paginação">
      <button
        type="button"
        className="ui-pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const showEllipsis = previous && page - previous > 1;
        return (
          <span key={page} style={{ display: 'flex', alignItems: 'center' }}>
            {showEllipsis && <span className="ui-pagination__ellipsis">…</span>}
            <button
              type="button"
              className={`ui-pagination__button ${
                page === currentPage ? 'ui-pagination__button--active' : ''
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        className="ui-pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        ›
      </button>
    </nav>
  );
}
