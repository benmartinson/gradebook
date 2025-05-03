import { useMutation, useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { Assignment } from "../../types";
import classNames from "classnames";
import AssignmentPageContainer from "./AssignmentPageContainer";

const setForm = (assignment: Assignment) => {
  return {
    description: assignment?.description || "",
    assignmentType: assignment?.assignmentType || "",
    assignedDate: assignment?.assignedDate || "",
    dueDate: assignment?.dueDate || "",
    maxPoints: assignment?.maxPoints || "",
    weight: assignment?.weight || "",
    notes: assignment?.notes || "",
    isExtraCredit: assignment?.isExtraCredit || false,
  };
};

const AssignmentDetails = ({ assignment }: { assignment: Assignment }) => {
  console.log(assignment);
  const { id } = useParams();
  const [hasMadeChanges, setHasMadeChanges] = useState(false);
  const updateAssignment = useMutation(api.gradebook.updateAssignment);
  const [formData, setFormData] = useState(setForm({} as any));
  const [savedFields, setSavedFields] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    setFormData(setForm(assignment));
  }, [assignment]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setHasMadeChanges(true);
  };

  const handleUpdateAssignment = async ({
    field,
    value,
  }: {
    field: string;
    value: any;
  }) => {
    await updateAssignment({
      field,
      value,
      id: id as Id<"assignments">,
    });
    setSavedFields((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setSavedFields((prev) => ({ ...prev, [field]: false }));
    }, 1500);
  };

  const saveButtonClasses = classNames(
    "bg-[#52b788]  text-white px-6 py-2 rounded-md transition-colors",
    {
      "hover:bg-[#40916c] cursor-pointer": hasMadeChanges,
      "opacity-50 cursor-default": !hasMadeChanges,
    }
  );

  if (!assignment) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full mr-auto p-6 pt-0">
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Description
              {savedFields.description && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "description",
                  value: formData.description,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Assignment Type
              {savedFields.assignmentType && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <input
              type="text"
              name="assignmentType"
              value={formData.assignmentType}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "assignmentType",
                  value: formData.assignmentType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Assigned Date
              {savedFields.assignedDate && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <input
              type="date"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "assignedDate",
                  value: formData.assignedDate,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Due Date
              {savedFields.dueDate && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "dueDate",
                  value: formData.dueDate,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Max Points
              {savedFields.maxPoints && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <input
              type="number"
              name="maxPoints"
              value={formData.maxPoints}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "maxPoints",
                  value: formData.maxPoints,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Weight
              {savedFields.weight && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "weight",
                  value: formData.weight,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Notes
              {savedFields.notes && (
                <span className="text-green-600 text-xs font-normal">
                  Saved!
                </span>
              )}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              onBlur={() =>
                handleUpdateAssignment({
                  field: "notes",
                  value: formData.notes,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default AssignmentDetails;
