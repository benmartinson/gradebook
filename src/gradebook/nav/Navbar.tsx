import { useState } from "react";
import Select from "react-select";
import { FaSort, FaBookOpen, FaExchangeAlt, FaPlus } from "react-icons/fa";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from "react-router-dom";
import { Id } from "../../../convex/_generated/dataModel";

const Navbar = ({ showGridControls }: { showGridControls?: boolean }) => {
  const navigate = useNavigate();
  const { class_id } = useParams();
  const classInfo = useQuery(api.classes.getClassInfo, {
    id: class_id as Id<"classes">,
  });

  const gradingPeriods = [
    { value: "q1", label: "Quarter 1" },
    { value: "q2", label: "Quarter 2" },
    { value: "q3", label: "Quarter 3" },
    { value: "q4", label: "Quarter 4" },
  ];

  const assignmentTypes = [
    { value: "all", label: "All Assignments" },
    { value: "homework", label: "Homework" },
    { value: "quiz", label: "Quizzes" },
    { value: "test", label: "Tests" },
    { value: "project", label: "Projects" },
  ];

  const addAssignment = useMutation(api.assignments.addAssignment);

  return (
    <div className="flex justify-between items-center py-1 px-6 border-b-2 border-gray-200 min-h-12">
      {classInfo?.name && (
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white px-3 py-1 rounded-lg">
            <div className="text-xl font-semibold">{classInfo?.name}</div>
          </div>
          <button
            className="p-1.5 text-gray-600 hover:text-[#52b788] bg-gray-100 rounded-full cursor-pointer transition-colors"
            title="Switch Class"
          >
            <FaExchangeAlt size={16} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        {showGridControls && (
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm">
            <div>Date Order</div>
            <FaSort size={16} />
          </button>
        )}

        {/* <div className="w-48">
          <Select
            options={gradingPeriods}
            defaultValue={gradingPeriods[0]}
            placeholder="Grading Period"
            className="text-sm"
          />
        </div>

        <div className="w-48">
          <Select
            options={assignmentTypes}
            defaultValue={assignmentTypes[0]}
            placeholder="Assignment Type"
            className="text-sm"
          />
        </div> */}
        {showGridControls && (
          <button
            className="flex items-center gap-1 bg-[#4caf73] text-white hover:bg-[#40916c] rounded-lg px-3 py-1 h-7 text-sm cursor-pointer"
            onClick={() => navigate(`/class/${class_id}/new-assignment`)}
          >
            <FaPlus size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
