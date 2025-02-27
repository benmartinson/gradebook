import { Assignment, Student } from "../../../types";
import { grades } from "../../mocks";

const StudentGradeRow = ({ assignment, student }: { assignment: Assignment, student: Student }) => {
  const grade = grades.find(g => g.assignmentId === assignment.id && g.studentId === student.id);
  return (
    <td className="bg-[#F6F6F4] rounded-lg">
      <div className="flex p-2 w-28 h-10 items-center justify-center">
        {grade ? grade.rawScore : "-"}
      </div>
    </td>
  );
};

export default StudentGradeRow;
