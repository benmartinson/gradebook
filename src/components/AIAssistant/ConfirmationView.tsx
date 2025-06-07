import React from "react";
import { FaSpinner } from "react-icons/fa";

interface GradeChange {
  action: "update";
  type: "grade";
  studentName?: string;
  student?: string;
  assignmentName?: string;
  assignment?: string;
  grade: number;
  studentId: string;
  assignmentId: string;
}

interface AssignmentChange {
  action: "create" | "update" | "delete";
  type: "assignment";
  assignmentId?: string;
  assignmentName?: string;
  field?: string;
  value?: string;
  assignment?: {
    description: string;
    dueDate: string;
    maxPoints: number;
    weight: number;
    assignmentType?: number;
  };
}

type Change = GradeChange | AssignmentChange;

interface ConfirmationViewProps {
  changesRequested: Change[];
  onConfirm: () => void;
  isUpdating: boolean;
  showConfirm: boolean;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  changesRequested,
  onConfirm,
  isUpdating,
  showConfirm,
}) => {
  const hasGradeChanges = changesRequested.some(
    (change) => change.type === "grade"
  );
  const hasAssignmentChanges = changesRequested.some(
    (change) => change.type === "assignment"
  );

  const renderAssignmentChange = (change: AssignmentChange, idx: number) => {
    if (change.action === "create" && change.assignment) {
      return (
        <div
          key={idx}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm font-medium mb-1">
            <span className="text-green-700">Create assignment</span> '
            {change.assignment.description}'
          </p>
          <div className="text-xs text-gray-600 space-y-1 ml-4">
            <p>
              Type:{" "}
              {change.assignment.assignmentType !== undefined
                ? `Type ${change.assignment.assignmentType}`
                : "Not specified"}
            </p>
            <p>Max points: {change.assignment.maxPoints}</p>
            <p>Weight: {change.assignment.weight}%</p>
            <p>
              Due date:{" "}
              {new Date(change.assignment.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    } else if (change.action === "delete") {
      return (
        <div
          key={idx}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm font-medium">
            <span className="text-red-700">Delete assignment</span> '
            {change.assignmentName}'
          </p>
        </div>
      );
    } else if (change.action === "update" && change.type === "assignment") {
      return (
        <div
          key={idx}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm font-medium mb-1">
            <span className="text-blue-700">Update assignment</span> '
            {change.assignmentName}' {`=>`} {change.field} = {change.value}
          </p>
          <div className="text-xs text-gray-600 space-y-1 ml-4"></div>
        </div>
      );
    }
    return null;
  };

  const renderGradeChange = (change: GradeChange, idx: number) => {
    return (
      <div
        key={idx}
        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
      >
        <p className="text-sm">
          <span className="text-blue-700">Update grade</span> for{" "}
          <span className="font-medium text-gray-700">
            {change.studentName || change.student}
          </span>{" "}
          - {change.assignmentName || change.assignment}:
          <span className="ml-2 font-semibold ">{change.grade}</span>
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg">
        <h3 className="font-semibold text-lg mb-4">
          Please confirm these{" "}
          {hasGradeChanges && hasAssignmentChanges
            ? "changes"
            : hasAssignmentChanges
              ? "assignment changes"
              : "grade changes"}
          :
        </h3>
        <div className="space-y-2">
          {changesRequested.map((change, idx) =>
            change.type === "assignment"
              ? renderAssignmentChange(change as AssignmentChange, idx)
              : renderGradeChange(change as GradeChange, idx)
          )}
        </div>
      </div>

      <div className="flex justify-end">
        {showConfirm && (
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="py-2 px-4 rounded-lg font-medium cursor-pointer transition-colors bg-white text-green-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? <FaSpinner className="animate-spin" /> : "Confirm"}
          </button>
        )}
      </div>
    </>
  );
};

export default ConfirmationView;
