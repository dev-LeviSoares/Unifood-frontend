import './Table.css';

/**
 * Tabela genérica orientada a dados — não sabe o que está listando
 * (produtos, pedidos, usuários), só recebe colunas e linhas.
 *
 * @param {Object} props
 * @param {{ key: string, header: string, render?: (row: any) => React.ReactNode }[]} props.columns
 * @param {any[]} props.rows
 * @param {string} [props.getRowKey] - nome do campo usado como key (default: 'id')
 * @param {React.ReactNode} [props.emptyState] - conteúdo mostrado quando `rows` está vazio
 */
export function Table({ columns, rows, getRowKey = 'id', emptyState }) {
  if (rows.length === 0) {
    return (
      <div className="ui-table-wrapper">
        <div className="ui-table__empty">{emptyState ?? 'Nenhum registro encontrado.'}</div>
      </div>
    );
  }

  return (
    <div className="ui-table-wrapper">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[getRowKey]}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
