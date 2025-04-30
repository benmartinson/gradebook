import { useQuery } from "convex/react";
import { assignments, students } from "../../mocks";
import Navbar from "../nav/Navbar";
import AssignmentInfo from "./AssignmentInfo";
import StudentGrade from "./StudentGrade";
import StudentInfo from "./StudentInfo";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import LoadingSpinner from '../common/LoadingSpinner';

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
          <h1 className="text-2xl font-semibold text-center text-gray-500 mt-16">No students are enrolled in this class.</h1>
        </div>
      </>
    );
  }

  if (!assignments) {
    return null;
  }
  console.log({assignments, students});

  return (
    <div className="">
      <Navbar />
      <div className="p-4 overflow-auto flex justify-center items-center w-[90vw]  overflow-hidden">
        <div className="flex w-full min-h-[80vh] max-h-[80vh]">
          {/* Fixed Student Info Table */}
          <div className="sticky left-0 z-10 bg-white w-fit">
            <table className="border-separate border-spacing-2" cellPadding={4} cellSpacing={0}>
              <tr>
                <th className="h-24">{/* Empty Spacer */}</th>
              </tr>
              {students.map((student) => (
                <tr key={student.id}>
                  <StudentInfo key={student.id} student={student} />
                </tr>
              ))}
            </table>
          </div>

          {/* Scrollable Grades Table */}
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-2" cellPadding={4} cellSpacing={0}>
              <tr>
                {assignments.map((assignment) => (
                  <AssignmentInfo key={assignment.id} assignment={assignment} />
                ))}
              </tr>

              {students.map((student) => (
                <tr key={student.id}>
                  {assignments.map((assignment) => (
                    <StudentGrade key={assignment._id+student._id} assignment={assignment} student={student} />
                  ))}
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Grid;
