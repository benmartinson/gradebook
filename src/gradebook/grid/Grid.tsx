import { useQuery } from "convex/react";
import { assignments, students } from "../../mocks";
import Navbar from "../nav/Navbar";
import AssignmentInfo from "./AssignmentInfo";
import StudentGrade from "./StudentGrade";
import StudentInfo from "./StudentInfo";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { useParams, useNavigate } from "react-router-dom";
import { Id } from "../../../convex/_generated/dataModel";
import { useSettingValue, useAppStore } from "../../appStore";
import { Assignment } from "../../../types";

const Grid = () => {
  const { class_id } = useParams();
  const assignmentsData = useQuery(api.assignments.getAssignments, {
    classId: class_id as Id<"classes">,
  });
  const students = useQuery(api.students.getStudentsByClass, {
    classId: class_id as Id<"classes">,
  });
  const grades = useQuery(api.grades.getGrades);
  const classInfo = useQuery(api.classes.getClassInfo, {
    id: class_id as Id<"classes">,
  });
  const { dateOrderAsc, isLoading, setIsLoading } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (students && assignmentsData && grades) {
      setIsLoading(false);
    }
  }, [students, assignmentsData, grades]);

  if (isLoading || !students) {
    return (
      <div className="flex flex-col h-full w-full">
        <Navbar classData={undefined} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!students.length && !isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <Navbar classData={undefined} />
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

  const classData = {
    className: classInfo?.name,
    students: students || [],
    assignments: assignmentsData || [],
    grades: grades || [],
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col bg-slate-50">
      <Navbar showGridControls={true} classData={classData} />

      <div className="hidden md:flex flex-1 overflow-auto hide-scrollbar">
        <div className="flex flex-col w-full bg-white">
          <div
            className="overflow-auto w-full"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              // @ts-ignore
              WebkitScrollbar: { display: "none" },
            }}
          >
            <div className="min-w-full inline-block w-full">
              <table className="border-collapse w-full">
                <thead className="sticky top-0 z-20 bg-slate-100 shadow-sm flex justify-start">
                  <tr className="bg-slate-100 shadow-sm flex justify-start">
                    <th className="sticky left-0  z-30 bg-slate-100 p-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap w-[200px]"></th>

                    {sortedAssignments.map((assignment) => (
                      <th
                        key={assignment._id}
                        className="p-2 text-left  bg-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap "
                      >
                        <AssignmentInfo assignment={assignment} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((student, idx) => (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50 transition-colors duration-150 group flex items-center justify-start"
                    >
                      <td className="sticky bg-white group-hover:bg-slate-50 left-0 z-10 p-2 whitespace-nowrap w-[200px] flex items-center ">
                        <StudentInfo student={student} />
                      </td>

                      {sortedAssignments.map((assignment) => (
                        <td
                          key={assignment._id}
                          className="p-2 whitespace-nowrap "
                        >
                          <StudentGrade
                            assignment={assignment}
                            student={student}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col space-y-3 overflow-y-auto p-4 flex-1 hide-scrollbar">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment._id}
            onClick={() => handleCardClick(assignment._id as Id<"assignments">)}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-150"
          >
            <div className="font-semibold text-slate-700 truncate mb-1">
              {assignment.description}
            </div>
            <div className="text-sm text-slate-500">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
          </div>
        ))}
        {sortedAssignments.length === 0 && (
          <div className="text-center text-slate-500 mt-8 text-lg">
            No assignments yet. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Grid;
