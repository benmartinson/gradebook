import StudentInfo from "./StudentInfo";
import { students } from "../../mocks";

const StudentColumn = () => {

  return (
    <table>
      {students.map((student) => (
        <StudentInfo key={student.id} student={student} />
      ))}
    </table>
  );
};

export default StudentColumn;