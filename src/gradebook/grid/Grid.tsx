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
import { useSettingValue, useAppStore } from "../../appStore";
const Grid = () => {
  const assignments = useQuery(api.assignments.getAssignments);
  const students = useQuery(api.students.getStudents);
  const grades = useQuery(api.grades.getGrades);
  const showClassGrade = useSettingValue("show_class_grade");
  const { dateOrderAsc } = useAppStore();

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

  const sortedAssignments = assignments.sort((a, b) => {
    if (dateOrderAsc) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
  });

  return (
    <div className="w-full h-full overflow-hidden flex flex-col pb-4">
      <Navbar showGridControls={true} />

      <div
        className="flex h-full overflow-scroll mt-4 ml-4 mr-4"
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

                {assignments.map((assignment) => (
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
                      {/* pl-[2px] removed from here */}
                      <div className="bg-white">
                        <StudentInfo student={student} />
                      </div>
                      {showClassGrade && (
                        <div className="bg-white">
                          <ClassGrade
                            student={student}
                            grades={grades}
                            assignments={assignments}
                          />
                        </div>
                      )}
                    </div>
                  </td>

                  {assignments.map((assignment) => (
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
    </div>
  );
};

export default Grid;
