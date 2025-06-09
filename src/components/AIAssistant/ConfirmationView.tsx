import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Confirmation from "./Confirmation";

export interface GradeChange {
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

export interface AssignmentChange {
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

export type Change = GradeChange | AssignmentChange;

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

  const hasGradeChanges = changesRequested.some(
    (change) => change.type === "grade"
  );
  const hasAssignmentChanges = changesRequested.some(
    (change) => change.type === "assignment"
  );

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
          {changesRequested.map((change, idx) => (
            <Confirmation key={idx} change={change} />
          ))}
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
