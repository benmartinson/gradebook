import { Assignment, Student } from "../../../types";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const StudentGrade = ({
  assignment,
  student,
}: {
  assignment: Assignment;
  student: Student;
}) => {
  const grades = useQuery(api.grades.getGrades);
  const navigate = useNavigate();
  const { class_id } = useParams();

  const grade = grades?.find(
    (g) => g.studentId === student._id && g.assignmentId === assignment._id
  );

  const handleClick = () => {
    navigate(`/class/${class_id}/assignment/${assignment._id}/grades`);
  };

  return (
    <td
      className="bg-[#F6F6F4] border border-[#E6E6E4] rounded-lg h-10 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex p-2 w-28 items-center justify-center relative">
        <div className="flex items-center gap-1">
          <div className="">{grade?.rawScore ?? "-"}</div>
          <span className="absolute right-5 top-0 bottom-0 flex items-center justify-center">
            <FaPencilAlt className="text-gray-400 text-sm group-hover:block hidden" />
          </span>
        </div>
      </div>
    </td>
  );
};

export default StudentGrade;
