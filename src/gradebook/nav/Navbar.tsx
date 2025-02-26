import { useState } from "react";
import Select from "react-select";
import { FaSort } from "react-icons/fa";

const Navbar = () => {
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

  return (
    <div className="flex justify-end items-center py-2 px-6 border-b border-gray-200">
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
