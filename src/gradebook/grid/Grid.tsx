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
import { useParams } from "react-router-dom";
import { Id } from "../../../convex/_generated/dataModel";

const Grid = () => {
  const assignments = useQuery(api.assignments.getAssignments);
  const students = useQuery(api.students.getStudents);
  const grades = useQuery(api.grades.getGrades);

  const { class_id } = useParams();
  const classInfo = useQuery(api.classes.getClassInfo, {
    id: class_id as Id<"classes">,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (students && assignments && grades) {
      setIsLoading(false);
    }
  }, [students, assignments, grades]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (!students?.length) {
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

  if (!assignments || !grades) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col pr-4 pb-4">
      <Navbar showGridControls={true} />

      <div
        className="flex h-full overflow-scroll mt-4 ml-4"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex flex-col">
          {/* Horizontal shield */}
          <div className="-mt-[2px] min-h-[2px] h-[2px] min-w-full w-full pointer-events-none z-40 bg-white sticky top-0 left-0"></div>
          <div className="flex">
            {/* Vertical shield - prevents horizontal jiggle */}
            <div className="top-0 left-0 min-w-[2px] -ml-[2px] h-[80vh] bg-white sticky z-40 pointer-events-none"></div>

            <table
              className="border-separate border-spacing-0.5 pr-2 pb-2"
              cellPadding={2}
              cellSpacing={0}
            >
              <thead>
                <tr className="sticky z-30 top-[2px] left-0.5">
                  <th className="sticky left-0.5 z-30 bg-white h-24"></th>

                  {assignments.map((assignment) => (
                    <th key={assignment._id} className="bg-white">
                      <AssignmentInfo assignment={assignment} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student._id}>
                    <td className="sticky left-0.5 z-20 bg-white p-0 border-0 pl-[2px]">
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
  );
};

export default Grid;
