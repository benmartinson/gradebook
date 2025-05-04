import { useQuery } from "convex/react";
import { Assignment } from "../../types";
import { api } from "../../convex/_generated/api";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { getStudentGradesObject } from "../helpers";
import { useMemo } from "react";
import StudentInfo from "../gradebook/grid/StudentInfo";

const AssignmentGrades = ({ assignment }: { assignment: Assignment }) => {
  const grades = useQuery(api.gradebook.getGrades);
  const students = useQuery(api.gradebook.getClassStudents);

  const studentGrades = useMemo(() => {
    if (!grades || !students) {
      return [];
    }
    return getStudentGradesObject(grades, students, assignment);
  }, [grades, students]);

  if (!grades || !students) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 pt-0">
      <div className="flex flex-col w-full">
        {/* Headers */}
        <div className="flex border-b border-gray-300 p-4 font-light text-sm opacity-50">
          <div className="w-1/6"></div>
          <div className="w-1/6 flex items-center justify-center">Grade</div>
          <div className="w-1/6 flex items-center justify-center">
            Completion Status
          </div>
          <div className="w-1/6 flex items-center justify-center">
            Dropbox Status
          </div>
          <div className="w-1/6 flex items-center justify-center">
            Published
          </div>
        </div>

        {/* Student Rows */}
        <div className="flex flex-col w-full h-[calc(100vh-250px)] overflow-y-scroll">
          {studentGrades.map((student) => (
            <div
              key={student._id}
              className="flex border-t border-gray-300 p-4"
            >
              <div className="w-1/6">
                <StudentInfo student={student} />
              </div>
              <div className="w-1/6 flex items-center justify-center">
                {student.grade?.rawScore}
              </div>
              <div className="w-1/6 flex items-center justify-center">-</div>
              <div className="w-1/6 flex items-center justify-center">-</div>
              <div className="w-1/6 flex items-center justify-center">-</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentGrades;
