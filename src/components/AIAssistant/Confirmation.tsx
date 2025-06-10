import React, { useState } from "react";
import { assignmentTypes } from "../../constants";
import type { Change } from "./ConfirmationView";
import type { GradeChange, AssignmentChange } from "../../../types";

interface ConfirmationProps {
  change: Change;
  onConfirm: () => void;
  onUpdateChange?: (updatedChange: Change) => void;
}

const ConfirmButton = ({ onConfirm }: { onConfirm: () => void }) => {
  return (
    <button
      onClick={onConfirm}
      className="text-sm cursor-pointer text-blue-600 underline hover:text-blue-800 ml-4"
    >
      Confirm
    </button>
  );
};

const Confirmation: React.FC<ConfirmationProps> = ({ change, onConfirm }) => {
  if (change.type === "grade") {
    const gradeChange = change as GradeChange;
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
        <p className="text-sm">
          <span className="text-blue-700">Update grade</span> for{" "}
          <span className="font-medium text-gray-700">
            {gradeChange.studentName || gradeChange.student}
          </span>{" "}
          - {gradeChange.assignmentName || gradeChange.assignment}:
          <span className="ml-2 font-semibold ">{gradeChange.grade}</span>
        </p>
        <ConfirmButton onConfirm={onConfirm} />
      </div>
    );
  }

  const assignmentChange = change as AssignmentChange;

  if (assignmentChange.action === "create" && assignmentChange.assignment) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between">
        <div>
          <p className="text-sm font-medium mb-1">
            <span className="text-slate-600">Create assignment</span> '
            {assignmentChange.assignment.description}'
          </p>
          <div className="text-xs text-slate-600 space-y-1 ml-4">
            <p>
              Type:{" "}
              {assignmentChange.assignment.type !== undefined
                ? `${assignmentTypes[assignmentChange.assignment.type].description}`
                : "Not specified"}
            </p>
            <p>Max points: {assignmentChange.assignment.maxPoints}</p>
            <p>Weight: {assignmentChange.assignment.weight}%</p>
            <p>
              Due date:{" "}
              {new Date(
                assignmentChange.assignment.dueDate
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
        <ConfirmButton onConfirm={onConfirm} />
      </div>
    );
  } else if (assignmentChange.action === "delete") {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
        <p className="text-sm font-medium">
          <span className="text-red-600">Delete assignment</span> '
          {assignmentChange.assignmentName}'
          <span className="text-xs text-gray-600">
            {" "}
            (This will also delete all grades associated with it.)
          </span>
        </p>
        <ConfirmButton onConfirm={onConfirm} />
      </div>
    );
  } else if (assignmentChange.action === "update") {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium mb-1">
            <span className="text-slate-600">Update assignment</span> '
            {assignmentChange.assignmentName}' {`=>`} {assignmentChange.field} ={" "}
            {assignmentChange.value}
          </p>
          <div className="text-xs text-gray-600 space-y-1 ml-4"></div>
        </div>
        <ConfirmButton onConfirm={onConfirm} />
      </div>
    );
  }

  return null;
};

export default Confirmation;
