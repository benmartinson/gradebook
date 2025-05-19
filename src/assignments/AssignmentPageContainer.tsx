import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { ReactNode, useEffect, useState } from "react";
import AssignmentDetails from "./AssignmentDetails";
import AssignmentGrades from "./AssignmentGrades";
import BackToScoresButton from "../gradebook/BackToScoresButton";
import Navbar from "../gradebook/nav/Navbar";
import { useAppStore } from "../appStore";

const AssignmentPageContainer = ({
  activeTab,
}: {
  activeTab: "details" | "grades";
}) => {
  const { id, class_id } = useParams();
  const grades = useQuery(api.grades.getGrades);
  const students = useQuery(api.students.getStudentsByClass, {
    classId: class_id as Id<"classes">,
  });
  const navigate = useNavigate();
  const { setIsLoading } = useAppStore();
  const assignment = useQuery(api.assignments.getAssignment, {
    id: id as Id<"assignments">,
  });

  useEffect(() => {
    setIsLoading(false);
  }, [assignment, grades, students]);

  if (!assignment || !grades || !students) {
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
        <div className="flex justify-between w-full p-6 max-md:pt-1">
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
        {activeTab === "grades" && (
          <AssignmentGrades
            assignment={assignment}
            grades={grades}
            students={students}
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentPageContainer;
