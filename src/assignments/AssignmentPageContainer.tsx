import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { ReactNode, useState } from "react";
import AssignmentDetails from "./AssignmentDetails";
import AssignmentGrades from "./AssignmentGrades";
import BackToScoresButton from "../gradebook/BackToScoresButton";
import Navbar from "../gradebook/nav/Navbar";

const AssignmentPageContainer = ({
  activeTab,
}: {
  activeTab: "details" | "grades";
}) => {
  const { id, class_id } = useParams();
  const navigate = useNavigate();
  const assignment = useQuery(api.assignments.getAssignment, {
    id: id as Id<"assignments">,
  });

  if (!assignment) {
    return (
      <div className="flex w-full flex-col h-full">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col h-full">
      <Navbar />
      <div className="flex flex-col">
        <div className="flex justify-between w-full p-6">
          <div className="font-bold text-2xl">{assignment?.description}</div>
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => navigate(`/class/${class_id}/assignment/${id}`)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "details"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Details
            </button>
            <div className="w-px bg-gray-300"></div>
            <button
              onClick={() =>
                navigate(`/class/${class_id}/assignment/${id}/grades`)
              }
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "grades"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Grades
            </button>
          </div>
        </div>
        {activeTab === "details" && (
          <AssignmentDetails assignment={assignment} />
        )}
        {activeTab === "grades" && <AssignmentGrades assignment={assignment} />}
      </div>
    </div>
  );
};

export default AssignmentPageContainer;
