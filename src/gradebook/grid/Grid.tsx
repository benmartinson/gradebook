import { assignments, students } from "../../mocks";
import AssignmentInfo from "./AssignmentInfo";
import StudentGradeRow from "./StudentGradeRow";
import StudentInfo from "./StudentInfo";

const Grid = () => {
  return (
    <table className="border-separate border-spacing-2" cellPadding={4} cellSpacing={0}>
      <tr>
        <th className=""></th>
        
        {assignments.map((assignment) => (
          <AssignmentInfo key={assignment.id} assignment={assignment} />
        ))}
      </tr>

      {students.map((student) => (
        <tr key={student.id}>
          <StudentInfo key={student.id} student={student} />

          {assignments.map((assignment) => (
            <StudentGradeRow key={assignment.id} assignment={assignment} student={student} />
          ))}
        </tr>
      ))}
    </table>
  );
};

export default Grid;
