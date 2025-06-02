import React, { ReactNode, useState } from "react";
import { TableColumn, TableItem } from "../../../types";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TableCell = ({
  itemValue,
  column,
  setEditedItem,
  editedItem,
}: {
  itemValue: any;
  column: TableColumn;
  setEditedItem: (item: any) => void;
  editedItem: any;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log({ value: e.target.value, editedItem });
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
  } else {
    content = (
      <input
        type="text"
        value={itemValue}
        onChange={handleChange}
        placeholder={column.placeholder}
        className="ring-none focus:ring-0 focus:outline-none w-full"
      />
    );
  }

  return (
    <td
      className={`px-4 h-8 border-r border-b border-slate-200`}
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
  onItemChange: (item: T) => void;
}

const TableRow = <
  T extends { _id: string; isNew?: boolean } & Record<string, any>,
>({
  className = "",
  tableColumns,
  onClick,
  item,
  onItemChange,
}: TableRowProps<T>) => {
  const handleCellChange = (changedItem: T) => {
    onItemChange(changedItem);
  };

  return (
    <tr className={`border-b border-slate-200 ${className}`} onClick={onClick}>
      {tableColumns.map((column, index) => (
        <TableCell
          key={index}
          itemValue={item[column.key]}
          column={column}
          setEditedItem={(partialUpdate) => {
            const updatedFullItem = { ...item, ...partialUpdate };
            handleCellChange(updatedFullItem);
          }}
          editedItem={item}
        />
      ))}
    </tr>
  );
};

export default TableRow;
