import React from 'react';

interface DataTableProps {
  columns: { header: string; accessor: string }[];
  data: any[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onEdit, onDelete }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(col => <th key={col.accessor}>{col.header}</th>)}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.accessor}>
                {col.accessor === 'status' ? (
                  <span className={`status-pill ${row[col.accessor]?.toLowerCase()}`}>
                    {row[col.accessor]}
                  </span>
                ) : (
                  row[col.accessor]
                )}
              </td>
            ))}
            <td className="actions-cell">
              <button onClick={() => onEdit(row.id)}>✏️</button>
            <button onClick={() => onDelete(row.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;