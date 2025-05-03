import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { ReactNode, useState } from "react";
import AssignmentDetails from "./AssignmentDetails";
import AssignmentGrades from "./AssignmentGrades";
import BackToScoresButton from "../gradebook/BackToScoresButton";

const AssignmentPageContainer = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"details" | "grades">("details");
  const assignment = useQuery(api.gradebook.getAssignment, {
    id: id as Id<"assignments">,
  });

  if (!assignment) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between w-full p-6">
        <div className="font-bold text-2xl">{assignment?.description}</div>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("details")}
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
            onClick={() => setActiveTab("grades")}
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
      {activeTab === "details" && <AssignmentDetails assignment={assignment} />}
      {activeTab === "grades" && <AssignmentGrades assignment={assignment} />}
    </div>
  );
};

export default AssignmentPageContainer;
