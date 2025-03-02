import React, { ReactNode, useState } from 'react';
import { TableColumn } from '../../../types';
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


interface TableRowProps {
  className?: string;
  onClick?: () => void;
  tableColumns: TableColumn[];
  item: any;
}

const TableRow = ({ 
  className = '', 
  tableColumns,
  onClick,
  item
}: TableRowProps) => {
  const [isEditing, setIsEditing] = useState(item.isNew);
  const [editedItem, setEditedItem] = useState(item);

  return (
    <tr 
      className={`border-b ${className} p-4`} 
      onClick={onClick}
    >
      {tableColumns.map((column, index) => (
        <TableCell key={index} itemValue={editedItem[column.key]} column={column} isEditing={isEditing} setEditedItem={setEditedItem} editedItem={editedItem} />
      ))}
      <div className="flex justify-end mr-4 items-center h-16">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing && (
            <div className="flex  justify-between w-16">
              {/* Checkmark */}
              <FaCheck className="text-green-500 w-6 h-6" />
              {/* X */}
              <FaXmark className="text-red-500 w-6 h-6" />
            </div>
          )}
        </button>
      </div>
    </tr>
  );
};

export default TableRow;


