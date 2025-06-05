import React from "react";
import { FaSpinner } from "react-icons/fa";

interface Change {
  studentName?: string;
  student?: string;
  assignmentName?: string;
  assignment?: string;
  grade: number;
}

interface ConfirmationViewProps {
  changesRequested: Change[];
  onConfirm: () => void;
  isUpdating: boolean;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  changesRequested,
  onConfirm,
  isUpdating,
}) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg">
        <h3 className="font-semibold text-lg mb-4">
          Please confirm these grade changes:
        </h3>
        <div className="space-y-2">
          {changesRequested.map((change, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-sm">
                <span className="font-medium">
                  {change.studentName || change.student}
                </span>{" "}
                - {change.assignmentName || change.assignment}:
                <span className="ml-2 font-semibold text-blue-600">
                  {change.grade}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          disabled={isUpdating}
          className="py-2 px-4 rounded-lg font-medium transition-colors bg-white text-green-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUpdating ? <FaSpinner className="animate-spin" /> : "Confirm"}
        </button>
      </div>
    </>
  );
};

export default ConfirmationView;