import { useState, useEffect } from "react";
import TableRow from "./TableRow";
import { TableColumn } from "../../../types";
import { FaPlus } from "react-icons/fa";
import classNames from "classnames";

interface TableProps<T> {
  columns: TableColumn[];
  list: T[];
  listName: string;
  className?: string;
  emptyMessage?: string;
  disableAdd?: boolean;
  handleAdd: (item: T) => void;
  handleDelete: (item: T) => void;
  addOnStart?: boolean;
}

const Table = <T extends { _id: any; isNew: boolean }>({
  columns,
  list,
  listName,
  className = "",
  emptyMessage = "No data found",
  disableAdd = false,
  handleAdd,
  handleDelete,
  addOnStart = false,
}: TableProps<T>) => {
  const [internalList, setInternalList] = useState<T[]>(list || []);
  const [fakeId, setFakeId] = useState(0);

  useEffect(() => {
    setInternalList(list);
  }, [list]);

  useEffect(() => {
    if (disableAdd) {
      if (internalList.some((item) => item.isNew)) {
        setInternalList((prevList) => prevList.filter((item) => !item.isNew));
      }
      return;
    }

    if (!internalList.some((item) => item.isNew)) {
      const newItem = {} as Record<string, any>;
      columns.forEach((column) => {
        newItem[column.key] = "";
      });
      newItem.isNew = true;
      newItem._id = `new-${fakeId}`;

      setFakeId((prevFakeId) => prevFakeId + 1);
      setInternalList((prevList) => [...prevList, newItem as T]);
    }
  }, [internalList, disableAdd, columns, fakeId, setInternalList, setFakeId]);

  const handleCancel = (item: T) => {
    if (item.isNew) {
      setInternalList(internalList.filter((i) => i._id !== item._id));
    } else {
      handleDelete(item);
    }
  };

  const isEmpty = internalList?.length === 0;

  return (
    <div className="w-full bg-slate-50 h-full">
      <div className="px-7 flex justify-between items-center h-10 border-b border-slate-400 bg-gray-100">
        <h1 className="text-2xl font-light"></h1>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {internalList.length} items
        </div>
      </div>
      <div className={` rounded-lg ${className} flex-1 h-full overflow-y-auto`}>
        <table className="table-fixed">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-slate-400 sticky top-0 ">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={
                    "text-sm text-left py-2 p-4 border-r border-slate-400 font-light"
                  }
                  style={{
                    maxWidth: column.width,
                    minWidth: column.width,
                    width: column.width,
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-auto bg-white">
            {internalList.map((item) => (
              <TableRow<T>
                key={item._id}
                item={item}
                tableColumns={columns}
                handleAdd={handleAdd}
                handleCancel={handleCancel}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
