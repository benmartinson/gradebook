import { useQuery } from "convex/react";
import { assignments, students } from "../../mocks";
import Navbar from "../nav/Navbar";
import AssignmentInfo from "./AssignmentInfo";
import StudentGrade from "./StudentGrade";
import StudentInfo from "./StudentInfo";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

const Grid = () => {
  const assignments = useQuery(api.gradebook.getAssignments);
  const students = useQuery(api.gradebook.getClassStudents);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (students && assignments) {
      setIsLoading(false);
    }
  }, [students, assignments]);

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

  if (!assignments) {
    return null;
  }

  return (
    <div className="">
      <Navbar />
      <div className="p-4 flex justify-center items-center w-[90vw]">
        <div className="w-full min-h-[80vh] max-h-[80vh] overflow-auto">
          <table
            className="border-separate border-spacing-0.5"
            cellPadding={2}
            cellSpacing={0}
          >
            <thead>
              <tr>
                {/* Top-left corner cell */}
                <th className="sticky top-0 left-0 z-30 bg-white h-24 w-[200px]">
                  {/* Empty corner */}
                </th>

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
                  {/* Fixed first column */}
                  <td className="sticky left-0 z-20 bg-white">
                    <StudentInfo student={student} />
                  </td>

                  {/* Student grades */}
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
