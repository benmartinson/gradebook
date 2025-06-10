import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import Table from "../gradebook/common/Table";
import { Assignment, TableColumn } from "../../types";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { useParams } from "react-router-dom";

type AssignmentFormData = Omit<Assignment, "maxPoints" | "weight"> & {
  maxPoints: string;
  weight: string;
};

const Assignments = () => {
  const { class_id } = useParams();
  const assignments = useQuery(api.assignments.getAssignments, {
    classId: class_id as Id<"classes">,
  });
  const addAssignment = useMutation(api.assignments.addAssignment);
  const deleteAssignment = useMutation(api.assignments.deleteAssignment);

  const handleAdd = async (item: Assignment & { isNew: boolean }) => {
    const { _id, isNew, ...assignmentPayload } = item;
    await addAssignment({
      ...assignmentPayload,
      classId: class_id as Id<"classes">,
    });
  };

  const handleDelete = async (assignment: Assignment) => {
    await deleteAssignment({
      id: assignment._id as Id<"assignments">,
    });
  };

  const tableColumns: TableColumn[] = [
    {
      key: "description",
      label: "Description",
      placeholder: "Assignment description",
      width: "min-w-40 max-w-40",
    },
    {
      key: "assignmentType",
      label: "Type",
      placeholder: "Type",
      width: "min-w-20 max-w-20",
    },
    {
      key: "weight",
      label: "Weight",
      placeholder: "0",
      width: "min-w-16 max-w-16",
    },
    {
      key: "maxPoints",
      label: "Max Points",
      placeholder: "100",
      width: "min-w-20 max-w-20",
    },
    {
      key: "dueDate",
      label: "Due Date",
      placeholder: "Select due date",
      width: "min-w-24 max-w-24",
    },
    {
      key: "assignedDate",
      label: "Assigned Date",
      placeholder: "Select assigned date",
      width: "min-w-24 max-w-24",
    },
  ];

  const mappedAssignments = assignments
    ? assignments.map((assignment) => ({
        ...assignment,
        isNew: false,
        id: assignment._id,
      }))
    : [];

  if (!assignments) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full  min-h-[80vh] max-h-[80vh]">
      <Table<Assignment & { isNew: boolean }>
        columns={tableColumns}
        list={mappedAssignments}
        listName="Assignments"
        emptyMessage="No assignments found. Add an assignment to get started."
        handleAdd={handleAdd}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Assignments;
