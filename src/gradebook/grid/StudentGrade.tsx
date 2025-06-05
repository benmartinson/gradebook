import { Assignment, Student } from "../../../types";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSettingValue } from "../../appStore";
import { Id } from "../../../convex/_generated/dataModel";
import { updateOrAddGrade } from "../../helpers";
import classNames from "classnames";

const StudentGrade = ({
  assignment,
  student,
}: {
  assignment: Assignment;
  student: Student;
}) => {
  const grades = useQuery(api.grades.getGrades);
  const allowGridGrading = useSettingValue("allow_grid_grading");
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editedGrade, setEditedGrade] = useState<string>("");
  const addGrade = useMutation(api.grades.addGrade);
  const updateGrade = useMutation(api.grades.updateGrade);
  const grade = grades?.find(
    (g) => g.studentId === student._id && g.assignmentId === assignment._id
  );
  const [gradeValue, setGradeValue] = useState<string>(
    grade?.rawScore?.toString() ?? ""
  );
  const hasEditedGrade = editedGrade !== "";

  useEffect(() => {
    if (allowGridGrading && isHovered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [allowGridGrading, isHovered]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHovered && e.key === "Enter") {
        handleGradeBlur();
        setIsHovered(false);
      }
    },
    [isHovered, editedGrade]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleClick = () => {
    if (hasEditedGrade) {
      handleGradeBlur();
    } else {
      setIsHovered(true);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedGrade(e.target.value.trim());
    setGradeValue(e.target.value.trim());
  };

  const handleGradeBlur = async () => {
    if (!hasEditedGrade) {
      return;
    }
    const score = parseFloat(editedGrade);
    await updateOrAddGrade(
      score,
      assignment._id,
      grades ?? [],
      student._id,
      addGrade,
      updateGrade
    );
    setEditedGrade("");
  };

  const shouldColorGrade = !allowGridGrading || !isHovered;
  const gradeClasses = classNames("flex items-center gap-1 h-6", {
    "text-red-400": shouldColorGrade && grade?.rawScore && grade.rawScore < 50,
    "font-semibold":
      shouldColorGrade &&
      grade?.rawScore &&
      grade.rawScore >= assignment.maxPoints,
  });

  return (
    <td
      className={`bg-[#F6F6F4] rounded-lg h-10 ${
        hasEditedGrade ? "cursor-pointer" : "cursor-default"
      } group`}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex p-2 w-32 items-center border border-[#E6E6E4] rounded-lg justify-center relative">
        <div className={gradeClasses} onMouseEnter={handleMouseEnter}>
          {allowGridGrading && isHovered ? (
            <input
              ref={inputRef}
              className="flex w-12 h-6 focus:outline-none rounded-lg text-center cursor-default"
              value={gradeValue}
              onChange={handleChange}
              type="text"
              onClick={(e) => e.stopPropagation()}
              onBlur={() => handleGradeBlur()}
            />
          ) : (
            <div className="">{grade?.rawScore ?? "-"}</div>
          )}
          <span className="absolute right-3 top-0 bottom-0 flex items-center justify-center">
            {hasEditedGrade && (
              <FaCheck className="text-green-400 text-sm group-hover:block hidden" />
            )}
          </span>
        </div>
      </div>
    </td>
  );
};

export default StudentGrade;
