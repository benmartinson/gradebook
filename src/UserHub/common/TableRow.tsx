import React, { ReactNode, useState } from "react";
import { TableColumn, TableItem } from "../../../types";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TableCell = ({
  itemValue,
  column,
  isEditing,
  setEditedItem,
  editedItem,
}: {
  itemValue: any;
  column: TableColumn;
  isEditing: boolean;
  setEditedItem: (item: any) => void;
  editedItem: any;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem({ ...editedItem, [column.key]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setEditedItem({
      ...editedItem,
      [column.key]: date ? date.toISOString().split("T")[0] : "",
    });
  };

  let content = null;
  if (column.key === "dueDate" || column.key === "assignedDate") {
    content = (
      <DatePicker
        selected={itemValue ? new Date(itemValue) : null}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        className="ring-none focus:ring-0 focus:outline-none w-full"
        placeholderText={column.placeholder}
      />
    );
  }

  content = (
    <input
      type="text"
      value={itemValue}
      onChange={handleChange}
      placeholder={column.placeholder}
      className="ring-none focus:ring-0 focus:outline-none"
    />
  );

  return (
    <td
      className={`px-4 h-8 border-r border-slate-200`}
      style={{
        maxWidth: column.width,
        minWidth: column.width,
        width: column.width,
      }}
    >
      {content}
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

const TableRow = <
  T extends { _id: string; isNew?: boolean } & Record<string, any>,
>({
  className = "",
  tableColumns,
  onClick,
  item,
  handleAdd,
  handleCancel,
}: TableRowProps<T>) => {
  const [isEditing, setIsEditing] = useState(item.isNew);
  const [editedItem, setEditedItem] = useState<T>(item);

  const handleAddClick = () => {
    delete editedItem.id;
    delete editedItem.isNew;
    handleAdd(editedItem);
    setIsEditing(false);
  };

  return (
    <tr className={`border-b border-slate-200 ${className}`} onClick={onClick}>
      {tableColumns.map((column, index) => (
        <TableCell
          key={index}
          itemValue={editedItem[column.key]}
          column={column}
          isEditing={Boolean(isEditing)}
          setEditedItem={setEditedItem}
          editedItem={editedItem}
        />
      ))}
      {/* <td className="flex justify-end mr-4 items-center h-12">
        <button>
          <div className="flex  justify-between w-16">
            {isEditing ? (
              <FaCheck
                className="text-green-500 w-6 h-6"
                onClick={handleAddClick}
              />
            ) : (
              <div className="w-6 h-6" />
            )}
            <FaXmark
              className="text-red-500 w-6 h-6"
              onClick={() => handleCancel(editedItem)}
            />
          </div>
        </button>
      </td> */}
    </tr>
  );
};

export default TableRow;
