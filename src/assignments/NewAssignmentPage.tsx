import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, useParams } from "react-router";
import Select, { ActionMeta, SingleValue } from "react-select";
import { assignmentTypes } from "../constants";
import { AssignmentType } from "../../types";
import BackToScoresButton from "../gradebook/BackToScoresButton";
import Navbar from "../gradebook/nav/Navbar";
import { useSettingValue } from "../appStore";
import { Id } from "../../convex/_generated/dataModel";

const NewAssignmentPage = () => {
  const addAssignment = useMutation(api.assignments.addAssignment);
  const allowAddAssignment = useSettingValue("allow_assignment_adding");
  const navigate = useNavigate();
  const { class_id } = useParams();
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

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      assignmentType: formData.assignmentType || 1,
      classId: class_id as Id<"classes">,
    };
    addAssignment(dataToSend);
    navigate("/gradebook");
  };

  if (!allowAddAssignment) {
    return (
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="w-full p-6">You are not allowed to add assignments</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="w-full p-6 max-sm:pt-0">
        <div className="mb-3 sm:mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">New Assignment</h1>
        </div>

        <div className="mr-auto">
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAssignmentPage;
