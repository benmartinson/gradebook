import { useState, useEffect } from "react";
import TableRow from "./TableRow";
import { TableColumn } from "../../../types";
import { FaCheck, FaPlus } from "react-icons/fa";
import classNames from "classnames";
import { FaX } from "react-icons/fa6";

interface TableProps<T> {
  columns: TableColumn[];
  list: T[];
  listName: string;
  className?: string;
  emptyMessage?: string;
  handleAdd: (item: T) => void;
  handleUpdate: (item: T) => void;
  handleDelete: (item: T) => void;
  addOnStart?: boolean;
}

const Table = <T extends { _id: any; isNew: boolean }>({
  columns,
  list,
  listName,
  className = "",
  emptyMessage = "No data found",
  handleAdd,
  handleUpdate,
  handleDelete,
  addOnStart = false,
}: TableProps<T>) => {
  const [internalList, setInternalList] = useState<T[]>(list || []);
  const [editedList, setEditedList] = useState<T[]>(list || []);
  const [fakeId, setFakeId] = useState(0);

  useEffect(() => {
    setInternalList(list);
    setEditedList(list);
  }, [list]);

  useEffect(() => {
    if (!editedList.some((item) => item.isNew)) {
      const newItem = {} as Record<string, any>;
      columns.forEach((column) => {
        newItem[column.key] = "";
      });
      newItem.isNew = true;
      newItem._id = `new-${fakeId}`;

      setFakeId((prevFakeId) => prevFakeId + 1);
      if (addOnStart) {
        setEditedList((prevList) => [newItem as T, ...prevList]);
      } else {
        setEditedList((prevList) => [...prevList, newItem as T]);
      }
    }
  }, [editedList, columns, fakeId, addOnStart]);

  const handleCancel = () => {
    setEditedList(list);
  };

  const isEmpty = editedList?.length === 0;

  const onItemChange = (updatedItem: T) => {
    setEditedList((currentList) =>
      currentList.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const addNewRow = () => {
    const newItem = {} as Record<string, any>;
    columns.forEach((column) => {
      newItem[column.key] = "";
    });
    newItem.isNew = true;
    newItem._id = `new-${fakeId}`;
    setFakeId((prevId) => prevId + 1);

    if (addOnStart) {
      setEditedList((prevList) => [newItem as T, ...prevList]);
    } else {
      setEditedList((prevList) => [...prevList, newItem as T]);
    }
  };

  const saveAllChanges = () => {
    const itemsToUpdate: T[] = [];
    const itemsToAdd: T[] = [];

    editedList.forEach((editedItem) => {
      if (editedItem.isNew) {
        const itemToAdd = { ...editedItem };
        // @ts-ignore
        delete itemToAdd._id;
        // @ts-ignore
        delete itemToAdd.isNew;
        itemsToAdd.push(itemToAdd as T);
      } else {
        const originalItem = internalList.find(
          (item) => item._id === editedItem._id
        );
        if (
          originalItem &&
          JSON.stringify(originalItem) !== JSON.stringify(editedItem)
        ) {
          itemsToUpdate.push(editedItem);
        }
      }
    });

    itemsToAdd.forEach((item) => handleAdd(item));
    itemsToUpdate.forEach((item) => handleUpdate(item));
  };

  const numCommittedItems = internalList.filter((i) => !i.isNew).length;
  const hasPendingChanges = editedList.some((editedItem) => {
    const originalItem = internalList.find(
      (item) => item._id === editedItem._id
    );
    if (
      originalItem &&
      JSON.stringify(originalItem) !== JSON.stringify(editedItem)
    ) {
      console.log({ originalItem, editedItem });
    }
    return (
      originalItem &&
      JSON.stringify(originalItem) !== JSON.stringify(editedItem)
    );
  });

  console.log({ hasPendingChanges });

  return (
    <>
      <div className="px-7 flex justify-between z-40 items-center sticky top-0 h-10 border-b border-slate-400 bg-gray-100">
        <div className="flex items-center gap-2">
          {editedList.some((item) => item.isNew) && hasPendingChanges && (
            <>
              <button
                onClick={saveAllChanges}
                className="px-2 py-0.5 flex items-center text-slate-600 hover:text-slate-800 gap-1.5 text-sm rounded cursor-pointer hover:border-slate-600 bg-slate-200"
                title="Save all changes"
                disabled={
                  !hasPendingChanges && !editedList.some((item) => item.isNew)
                }
              >
                Save Changes
                <span className="text-xs ">
                  <FaCheck />
                </span>
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-0.5 flex items-center text-red-600 hover:text-red-800 gap-1.5 text-sm rounded cursor-pointer hover:border-red-600 bg-slate-200"
                title="Cancel all changes"
                disabled={
                  !hasPendingChanges && !editedList.some((item) => item.isNew)
                }
              >
                Cancel Changes
                <span className="text-xs ">
                  <FaX />
                </span>
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <button
            onClick={addNewRow}
            className="p-1 text-green-500 hover:text-green-700"
            title="Add new row"
          >
            <FaPlus />
          </button>

          <span>
            {numCommittedItems} {numCommittedItems === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
      <div
        className={` rounded-lg ${className} w-full bg-slate-50 flex-1 overflow-y-auto pb-10 pr-10`}
      >
        <table className="border-separate border-spacing-0">
          {/* <thead className="bg-white z-30 relative">
            <tr className="bg-white z-30 relative">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={
                    "text-sm text-left py-2 p-4 border-r border-b border-slate-400 font-light sticky top-0 z-40 bg-white shadow-sm"
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
          </thead> */}
          <tbody className="overflow-y-auto bg-white">
            {editedList.map((item) => (
              <TableRow<T>
                key={item._id}
                item={item}
                tableColumns={columns}
                onItemChange={onItemChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
