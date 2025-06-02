import { useMutation, useQuery } from "convex/react";
import { tableColumns } from "../../constants";
import Table from "./Table";
import { api } from "../../../convex/_generated/api";

const TablePage = ({ tableDef }: { tableDef: string }) => {
  const records = useQuery(api.records.getRecords, {
    tableDef,
  });
  const createRecord = useMutation(api.records.createRecord);
  const updateRecord = useMutation(api.records.updateRecord);
  const deleteRecord = useMutation(api.records.deleteRecord);

  const handleAdd = async (item: any) => {
    console.log({ item });
    await createRecord({
      tableDef,
      record: item,
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <Table
        columns={tableColumns[tableDef]}
        list={records || []}
        listName={tableDef}
        emptyMessage="No Records Found"
        handleAdd={handleAdd}
        handleDelete={() => {}}
        addOnStart={true}
      />
    </div>
  );
};

export default TablePage;
