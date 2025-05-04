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

const Grid = () => {
  const assignments = useQuery(api.gradebook.getAssignments);
  const students = useQuery(api.gradebook.getClassStudents);
  const grades = useQuery(api.gradebook.getGrades);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (students && assignments && grades) {
      setIsLoading(false);
    }
  }, [students, assignments, grades]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  if (!students?.length) {
    return (
      <>
        <Navbar />
        <div className="p-4 overflow-auto">
          <h1 className="text-2xl font-semibold text-center text-gray-500 mt-16">
            No students are enrolled in this class.
          </h1>
        </div>
      </>
    );
  }

  if (!assignments || !grades) {
    return null;
  }

  return (
    <div className="">
      <Navbar />
      <div className="p-4 flex justify-center items-center w-[90vw]">
        <div
          className="w-full min-h-[80vh] max-h-[80vh] overflow-auto hide-scrollbars relative"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* Horizontal shield */}
          <div className="-mt-[2px] h-[2px] w-full pointer-events-none z-40 bg-white sticky top-0 left-0"></div>

          {/* Left column shield */}
          <div className="absolute top-0 left-0 -ml-[2px] w-[2px] h-full bg-white z-30 pointer-events-none sticky left-0"></div>
          <table className="border-separate table-fixed border-spacing-0.5">
            <thead>
              <tr className="sticky z-30 top-0.5">
                <th className="sticky top-[2px] left-[-2px] z-30 bg-white h-24 pl-[2px]"></th>

                {assignments.map((assignment) => (
                  <th
                    key={assignment._id}
                    className="sticky top-0 z-20 bg-white"
                  >
                    <AssignmentInfo assignment={assignment} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student._id}>
                  <td className="sticky left-[2px] z-20 bg-white p-0 border-0 pl-[2px]">
                    <div className="flex justify-between">
                      <div className="bg-white">
                        <StudentInfo student={student} />
                      </div>
                      <div className="bg-white">
                        <ClassGrade
                          student={student}
                          grades={grades}
                          assignments={assignments}
                        />
                      </div>
                    </div>
                  </td>

                  {assignments.map((assignment) => (
                    <td key={assignment._id}>
                      <StudentGrade assignment={assignment} student={student} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Grid;
