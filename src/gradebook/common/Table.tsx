import { useState, useEffect } from 'react';
import TableRow from './TableRow';
import { TableColumn } from '../../../types';

interface TableProps<T> {
  columns: TableColumn[];
  list: T[];
  listName: string;
  className?: string;
  emptyMessage?: string;
  disableAdd?: boolean;
}

function Table<T>({ 
  columns, 
  list,
  listName,
  className = '', 
  emptyMessage = 'No data found',
  disableAdd = false,
}: TableProps<T>) {
  const [internalList, setInternalList] = useState<T[]>(list);
  const [fakeId, setFakeId] = useState(0);
  
  useEffect(() => {
    setInternalList(list);
  }, [list]);

  const handleAdd = () => {
    const newItem = {} as Record<string, any>;
    columns.forEach(column => {
      newItem[column.key] = '';
    });
    newItem.isNew = true;
    newItem.id = fakeId;
    setFakeId(fakeId + 1);
    setInternalList([...internalList, newItem as unknown as T]);
  }
  
  const isEmpty = internalList.length === 0;

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{listName}</h1>
        {!disableAdd && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 flex items-center cursor-pointer"
            onClick={handleAdd}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}
      </div>

      <div className={`bg-white rounded-lg shadow ${className}`}>
        <table className="min-w-full table-fixed">
          <thead>
            <tr className="border-b">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`text-left p-4`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              internalList.map(item => <TableRow item={item} tableColumns={columns} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table; 