import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { assignmentTypes } from "../../constants";

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
    type?: number;
  };
}

type Change = GradeChange | AssignmentChange;

interface ConfirmationViewProps {
  changesRequested: Change[];
  onConfirm: () => void;
  isUpdating: boolean;
  showConfirm: boolean;
  permissions: {
    allowAssignmentUpdate: boolean;
    allowAssignmentCreation: boolean;
    allowAssignmentDeletion: boolean;
    allowGradeUpdate: boolean;
  };
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  changesRequested,
  onConfirm,
  isUpdating,
  showConfirm,
  permissions,
}) => {
  const hasGradeChanges = changesRequested.some(
    (change) => change.type === "grade"
  );
  const hasAssignmentChanges = changesRequested.some(
    (change) => change.type === "assignment"
  );
  const [showError, setShowError] = useState<string | null>(null);

  const handleConfirm = () => {
    setShowError(null);
    const hasPermission = changesRequested.every((request) => {
      if (request.type === "assignment") {
        if (request.action === "create") {
          return permissions.allowAssignmentCreation;
        } else if (request.action === "update") {
          return permissions.allowAssignmentUpdate;
        } else if (request.action === "delete") {
          return permissions.allowAssignmentDeletion;
        }
      } else if (request.type === "grade") {
        return permissions.allowGradeUpdate;
      }
    });

    if (hasPermission) {
      onConfirm();
    } else {
      setShowError(
        "You do not have permission to perform one or more of the actions requested. Contact your adminitrator if this is an error."
      );
    }
  };

  const renderAssignmentChange = (change: AssignmentChange, idx: number) => {
    if (change.action === "create" && change.assignment) {
      return (
        <div
          key={idx}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm font-medium mb-1">
            <span className="text-slate-600">Create assignment</span> '
            {change.assignment.description}'
          </p>
          <div className="text-xs text-slate-600 space-y-1 ml-4">
            <p>
              Type:{" "}
              {change.assignment.type !== undefined
                ? `${assignmentTypes[change.assignment.type].description}`
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
            <span className="text-slate-600">Delete assignment</span> '
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
            <span className="text-slate-600">Update assignment</span> '
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
        <h3 className="font-light text-lg mb-4">
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
        {!showError && showConfirm && (
          <button
            onClick={handleConfirm}
            disabled={isUpdating}
            className="py-2 px-4 rounded-lg font-medium cursor-pointer transition-colors bg-white text-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? <FaSpinner className="animate-spin" /> : "Confirm"}
          </button>
        )}
        {showError && <p className="text-red-500 text-sm">{showError}</p>}
      </div>
    </>
  );
};

export default ConfirmationView;
