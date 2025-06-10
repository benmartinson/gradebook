import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Confirmation from "./Confirmation";
import { GradeChange, AssignmentChange } from "../../../types";

export type Change = GradeChange | AssignmentChange;
interface ConfirmationViewProps {
  changesRequested: Change[];
  onConfirm: () => void;
  onConfirmSingle: (change: Change) => void;
  onUpdateChange: (index: number, updatedChange: Change) => void;
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
  onConfirmSingle,
  onUpdateChange,
  isUpdating,
  showConfirm,
  permissions,
}) => {
  const [showError, setShowError] = useState<string | null>(null);

  const checkPermission = (change: Change) => {
    if (change.type === "assignment") {
      if (change.action === "create") {
        return permissions.allowAssignmentCreation;
      } else if (change.action === "update") {
        return permissions.allowAssignmentUpdate;
      } else if (change.action === "delete") {
        return permissions.allowAssignmentDeletion;
      }
    } else if (change.type === "grade") {
      return permissions.allowGradeUpdate;
    }
    return false;
  };

  const handleConfirm = () => {
    setShowError(null);
    const hasPermission = changesRequested.every(checkPermission);

    if (hasPermission) {
      onConfirm();
    } else {
      setShowError(
        "You do not have permission to perform one or more of the actions requested. Contact your administrator if this is an error."
      );
    }
  };

  const handleSingleConfirm = (change: Change) => {
    setShowError(null);
    if (checkPermission(change)) {
      onConfirmSingle(change);
    } else {
      setShowError(
        "You do not have permission to perform this action. Contact your administrator if this is an error."
      );
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg">
        <h3 className="font-light text-lg mb-4">
          Please confirm these changes
        </h3>
        <div className="space-y-2">
          {changesRequested.map((change, idx) => (
            <Confirmation
              key={idx}
              change={change}
              onConfirm={() => handleSingleConfirm(change)}
              onUpdateChange={(updatedChange) => onUpdateChange(idx, updatedChange)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        {!showError && showConfirm && changesRequested.length > 1 && (
          <button
            onClick={handleConfirm}
            disabled={isUpdating}
            className="py-2 px-4 rounded-lg font-medium cursor-pointer transition-colors bg-white text-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Confirm All"
            )}
          </button>
        )}
        {showError && <p className="text-red-500 text-sm">{showError}</p>}
      </div>
    </>
  );
};

export default ConfirmationView;
