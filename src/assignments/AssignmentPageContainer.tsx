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

const AssignmentPageContainer = () => {
  const { id, class_id } = useParams();
  const grades = useQuery(api.grades.getGrades);
  const students = useQuery(api.students.getStudentsByClass, {
    classId: class_id as Id<"classes">,
  });
  const navigate = useNavigate();
  const { setIsLoading } = useAppStore();
  const assignment = useQuery(api.assignments.getAssignment, {
    assignmentId: id as Id<"assignments">,
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
        </div>
        <AssignmentGrades
          assignment={assignment}
          grades={grades}
          students={students}
        />
      </div>
    </div>
  );
};

export default AssignmentPageContainer;
