import { useQuery } from "convex/react";
import { assignments, students } from "../../mocks";
import Navbar from "../nav/Navbar";
import AssignmentInfo from "./AssignmentInfo";
import StudentGrade from "./StudentGrade";
import StudentInfo from "./StudentInfo";
import { api } from "../../../convex/_generated/api";

const Grid = () => {
  const assignments = useQuery(api.gradebook.getAssignments);
  const students = useQuery(api.gradebook.getClassStudents);

  if (!students?.length) {
    return (
      <>
        <Navbar />
        <div className="p-4 overflow-auto">
          <h1 className="text-2xl font-semibold text-center text-gray-500 mt-16">No students are enrolled in this class.</h1>
        </div>
      </>
    );
  }

  if (!assignments) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="p-4 overflow-auto">
        <table className="border-separate border-spacing-2" cellPadding={4} cellSpacing={0}>
          <tr>
            <th className="">{/* Empty Spacer */}</th>
            {assignments.map((assignment) => (
              <AssignmentInfo key={assignment.id} assignment={assignment} />
            ))}
          </tr>

          {students.map((student) => (
            <tr key={student.id}>
              <StudentInfo key={student.id} student={student} />

              {assignments.map((assignment) => (
                <StudentGrade key={assignment.id} assignment={assignment} student={student} />
              ))}
            </tr>
          ))}
        </table>
      </div>
    </>
  );
};

export default Grid;
