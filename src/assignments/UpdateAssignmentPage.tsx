import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, useParams } from "react-router";
import Select, { ActionMeta, SingleValue } from "react-select";
import { assignmentTypes } from "../constants";
import { AssignmentType } from "../../types";
import BackToScoresButton from "../gradebook/BackToScoresButton";
import Navbar from "../gradebook/nav/Navbar";
import { useSettingValue } from "../appStore";
import { Id } from "../../convex/_generated/dataModel";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";

const UpdateAssignmentPage = () => {
  const updateAssignment = useMutation(api.assignments.updateAssignment);
  const allowAddAssignment = useSettingValue("allow_assignment_adding");
  const navigate = useNavigate();
  const { class_id, assignment_id } = useParams();

  const assignment = useQuery(api.assignments.getAssignment, {
    assignmentId: assignment_id as Id<"assignments">,
  });

  const [formData, setFormData] = useState({
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    assignmentType: 1,
    weight: 100,
    maxPoints: 100,
    assignedDate: new Date().toISOString().split("T")[0],
    notes: "",
    isExtraCredit: false,
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        description: assignment.description || "",
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        assignmentType: assignment.assignmentType || 1,
        weight: assignment.weight || 100,
        maxPoints: assignment.maxPoints || 100,
        assignedDate: assignment.assignedDate
          ? new Date(assignment.assignedDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        notes: assignment.notes || "",
        isExtraCredit: assignment.isExtraCredit || false,
      });
    }
  }, [assignment]);

  const assignmentTypeOptions = assignmentTypes.map((type: AssignmentType) => ({
    value: type.id.toString(),
    label: type.description,
  }));

  const selectedAssignmentType = assignmentTypeOptions.find(
    (option: { value: string; label: string }) =>
      option.value === formData.assignmentType.toString()
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [actionMeta.name!]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleUpdateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      assignmentType: Number(formData.assignmentType) || 1,
      assignmentId: assignment_id as Id<"assignments">,
    };
    updateAssignment(dataToSend);
    navigate(`/class/${class_id}/gradebook`);
  };

  if (!allowAddAssignment) {
    return (
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="w-full p-6">
          You are not allowed to update assignments
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="w-full flex flex-col">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="w-full p-6 max-md:pt-0">
        <div className="mb-3 md:mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Update Assignment</h1>
        </div>

        <div className="mr-auto">
          <form onSubmit={handleUpdateAssignment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Type
                </label>
                <Select
                  name="assignmentType"
                  options={assignmentTypeOptions}
                  value={selectedAssignmentType}
                  onChange={handleSelectChange}
                  className="w-full basic-single"
                  classNamePrefix="select"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Date
                </label>
                <input
                  type="date"
                  name="assignedDate"
                  value={formData.assignedDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Points
                </label>
                <input
                  type="number"
                  name="maxPoints"
                  value={formData.maxPoints}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAssignmentPage;
