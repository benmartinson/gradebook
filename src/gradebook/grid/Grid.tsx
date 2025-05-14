import { useQuery } from "convex/react";
import { assignments, students } from "../../mocks";
import Navbar from "../nav/Navbar";
import AssignmentInfo from "./AssignmentInfo";
import StudentGrade from "./StudentGrade";
import StudentInfo from "./StudentInfo";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import ClassGrade from "./ClassGrade";
import { useParams, useNavigate } from "react-router-dom";
import { Id } from "../../../convex/_generated/dataModel";
import { useSettingValue, useAppStore } from "../../appStore";
import { Assignment } from "../../../types";

const Grid = () => {
  const assignmentsData = useQuery(api.assignments.getAssignments);
  const students = useQuery(api.students.getStudents);
  const grades = useQuery(api.grades.getGrades);
  const showClassGrade = useSettingValue("show_class_grade");
  const { dateOrderAsc, isLoading, setIsLoading } = useAppStore();
  const navigate = useNavigate();
  const { class_id } = useParams();

  useEffect(() => {
    if (students && assignmentsData && grades) {
      setIsLoading(false);
    }
  }, [students, assignmentsData, grades]);

  if (isLoading || !students) {
    return (
      <div className="flex flex-col h-full w-full">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (!students.length && !isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <Navbar />
        <div className="p-4 overflow-auto">
          <h1 className="text-2xl font-semibold text-center text-gray-500 mt-16">
            No students are enrolled in this class.
          </h1>
        </div>
      </div>
    );
  }

  if (!assignmentsData || !grades) {
    return null;
  }

  const sortedAssignments: Assignment[] = [...assignmentsData].sort((a, b) => {
    if (dateOrderAsc) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
  });

  const handleCardClick = (assignmentId: Id<"assignments">) => {
    navigate(`/class/${class_id}/assignment/${assignmentId}`);
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col pb-4">
      <Navbar showGridControls={true} />

      <div
        className="hidden md:flex h-full overflow-scroll mt-4 ml-4 mr-4"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex flex-col pr-4">
          <table className="border-collapse w-full">
            <thead>
              <tr className="sticky top-0 z-20 bg-white">
                <th className="sticky left-0 z-30 bg-white h-24 p-[2px]"></th>

                {sortedAssignments.map((assignment) => (
                  <th key={assignment._id} className="bg-white p-[2px]">
                    <AssignmentInfo assignment={assignment} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student._id}>
                  <td className="sticky left-0 z-10 bg-white p-[2px]">
                    <div className="flex justify-between">
                      {" "}
                      <div className="bg-white">
                        <StudentInfo student={student} />
                      </div>
                      {showClassGrade && (
                        <div className="bg-white">
                          <ClassGrade
                            student={student}
                            grades={grades}
                            assignments={sortedAssignments}
                          />
                        </div>
                      )}
                    </div>
                  </td>

                  {sortedAssignments.map((assignment) => (
                    <td key={assignment._id} className="p-[2px]">
                      <StudentGrade assignment={assignment} student={student} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden flex flex-col space-y-3 overflow-y-auto p-4  pt-0">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-md cursor-pointer"
            onClick={() => handleCardClick(assignment._id as Id<"assignments">)}
          >
            <div className="font-semibold text-gray-800 truncate mb-1">
              {assignment.description}
            </div>
            <div className="text-sm text-gray-500">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
          </div>
        ))}
        {sortedAssignments.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No assignments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Grid;
