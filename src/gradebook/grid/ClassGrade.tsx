import { Assignment, Grade, Student } from "../../../types";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentClassGrade } from "../../helpers";

const ClassGrade = ({
  student,
  grades,
  assignments,
}: {
  student: Student;
  grades: Grade[];
  assignments: Assignment[];
}) => {
  const classGrade = getStudentClassGrade(grades, student, assignments);

  return (
    <td className="bg-[#e3f2fd] rounded-lg h-10">
      <div className="flex p-2 w-28 items-center border border-[#64b5f6] rounded-lg justify-center relative">
        <div className="flex items-center gap-1">
          <div className="font-semibold">{classGrade ?? "-"}</div>
        </div>
      </div>
    </td>
  );
};

export default ClassGrade;
