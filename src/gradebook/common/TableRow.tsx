import React, { ReactNode, useState } from 'react';
import { TableColumn, TableItem } from '../../../types';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from "react-icons/fa6";


const TableCell = ({ itemValue, column, isEditing, setEditedItem, editedItem }: { itemValue: any, column: TableColumn, isEditing: boolean, setEditedItem: (item: any) => void, editedItem: any }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem({ ...editedItem, [column.key]: e.target.value });
  }

  if (isEditing) {
    return (
      <td className={`p-4 ring-none`}>
        <input type="text" value={itemValue} onChange={handleChange} placeholder={column.placeholder} className="ring-none focus:ring-0 focus:outline-none"/>
      </td>
    );
  }

  return (
    <td className={`p-4`}>
      {itemValue}
    </td>
  );
};


interface TableRowProps<T> {
  className?: string;
  onClick?: () => void;
  tableColumns: TableColumn[];
  item: T;
  handleAdd: (item: T) => void;
  handleCancel: (item: T) => void;
}

const TableRow = <T extends {_id: string, isNew: boolean} & Record<string, any>,>({ 
  className = '', 
  tableColumns,
  onClick,
  item,
  handleAdd,
  handleCancel
}: TableRowProps<T>) => {
  const [isEditing, setIsEditing] = useState(item.isNew);
  const [editedItem, setEditedItem] = useState<T>(item);

  const handleAddClick = () => {
    handleAdd(editedItem);
    setIsEditing(false);
  }

  return (
    <tr 
      className={`border-b ${className} p-4`} 
      onClick={onClick}
    >
      {tableColumns.map((column, index) => (
        <TableCell key={index} itemValue={editedItem[column.key]} column={column} isEditing={isEditing} setEditedItem={setEditedItem} editedItem={editedItem} />
      ))}
      <td className="flex justify-end mr-4 items-center h-16">
        <button>
            <div className="flex  justify-between w-16">
              {isEditing && (
                <FaCheck className="text-green-500 w-6 h-6" onClick={handleAddClick}/>
              )}
              <FaXmark className="text-red-500 w-6 h-6" onClick={() => handleCancel(editedItem)}/>
            </div>
        </button>
      </td>
    </tr>
  );
};

export default TableRow;


