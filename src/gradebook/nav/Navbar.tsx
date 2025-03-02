import { useState } from "react";
import Select from "react-select";
import { FaSort } from "react-icons/fa";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
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

  const addAssignment = useMutation(api.gradebook.addAssignment);

  return (
    <div className="flex justify-between items-center py-2 px-6 border-b-2 border-gray-200">
      <div></div>
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
          <div>Date Order</div>
          <FaSort size={20} />
        </button>
        
        <div className="w-48">
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
