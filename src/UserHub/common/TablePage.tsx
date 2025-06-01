import { useMutation } from "convex/react";
import { tableColumns } from "../../constants";
import Table from "./Table";
import { api } from "../../../convex/_generated/api";

const TablePage = ({ tableDef }: { tableDef: string }) => {
  const createClass = useMutation(api.classes.createClass);

  const handleAdd = async (item: any) => {
    await createClass({
      tableDef: "classesNew",
      record: {
        name: "New Class",
        startDate: "2021-01-01",
        endDate: "2021-01-01",
        classCode: "123456",
      },
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <Table
        columns={tableColumns[tableDef]}
        list={[]}
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
