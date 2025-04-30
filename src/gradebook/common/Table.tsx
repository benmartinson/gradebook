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
  handleAdd: (item: T) => void;
  handleDelete: (item: T) => void;
}

const Table = <T extends {_id: any, isNew: boolean},>({ 
  columns, 
  list,
  listName,
  className = '', 
  emptyMessage = 'No data found',
  disableAdd = false,
  handleAdd,
  handleDelete,
}: TableProps<T>) => {
  const [internalList, setInternalList] = useState<T[]>(list || []);
  const [fakeId, setFakeId] = useState(0);
  
  useEffect(() => {
    setInternalList(list);
  }, [list]);

  const handleAddNewItem = () => {
    if (internalList.some(item => item.isNew)) {
      return;
    }
    
    const newItem = {} as Record<string, any>;
    columns.forEach(column => {
      newItem[column.key] = '';
    });
    newItem.isNew = true;
    newItem.id = fakeId;
    setFakeId(fakeId + 1);
    setInternalList([...internalList, newItem as T]);
  }

  const handleCancel = (item: T) => {
    if (item.isNew) {
      setInternalList(internalList.filter(i => i._id !== item._id));
    } else {
      handleDelete(item);
    }
  }
  
  const isEmpty = internalList?.length === 0;

  return (
    <div className="w-full">
      <div className="px-5 flex justify-between items-center bg-white h-20">
        <h1 className="text-2xl font-bold">{listName}</h1>
        {!disableAdd && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 flex items-center cursor-pointer"
            onClick={handleAddNewItem}
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
      {!isEmpty && (
        <div className={`bg-white rounded-lg ${className} px-6 flex-1  min-h-[80vh] max-h-[80vh] overflow-y-auto`}>
            <table className="min-w-full table-fixed">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  {columns.map((column, index) => (
                    <th 
                      key={index} 
                      className={`text-left p-4 ${column.width}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="text-left p-4 min-w-16 max-w-16"></th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {internalList.map(item => <TableRow<T> item={item} tableColumns={columns} handleAdd={handleAdd} handleCancel={handleCancel} />)}
              </tbody>
            </table>
        </div>
      )}
    </div>
  );
}

export default Table;
