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
          className="w-full min-h-[80vh] max-h-[80vh] overflow-auto hide-scrollbars"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <style>
            {`.hide-scrollbars::-webkit-scrollbar {display: none;}`}
          </style>
          <table
            className="border-separate border-spacing-0.5"
            cellPadding={2}
            cellSpacing={0}
          >
            <thead>
              <tr>
                {/* Top-left corner cell */}
                <th className="sticky top-0 left-0 z-30 bg-white h-24"></th>

                {/* Fixed header row */}
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
              {students.map((student) => (
                <tr key={student._id}>
                  {/* Grouped sticky container for both columns */}
                  <td className="sticky left-0 z-20 bg-white p-0 border-0">
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
