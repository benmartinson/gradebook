import { Assignment, Student } from "../../../types";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { FaCheck, FaCheckCircle, FaPencilAlt } from "react-icons/fa";
import { Id } from "../../../convex/_generated/dataModel";

const StudentGrade = ({ assignment, student }: { assignment: Assignment, student: Student }) => {
  const grades = useQuery(api.gradebook.getGrades);
  const addGrade = useMutation(api.gradebook.addGrade);
  const updateGrade = useMutation(api.gradebook.updateGrade);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedScore, setEditedScore] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  
  const grade = grades?.find(
    g => g.studentId === student._id && g.assignmentId === assignment._id
  );

  const handleClick = () => {
    setIsEditing(true);
    setEditedScore(grade?.rawScore?.toString() || "");
  };

  const handleBlur = async () => {
    setIsEditing(false);
    setIsSaving(true);
    const score = parseFloat(editedScore);
    if (!isNaN(score) && score >= 0) {
      if (grade) {
        await updateGrade({
          id: grade._id as Id<"grades">,
          rawScore: score,
        });
      } else {
        await addGrade({
          studentId: student._id as Id<"students">,
          assignmentId: assignment._id as Id<"assignments">,
          rawScore: score,
        });
      }
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing && editedScore !== grade?.rawScore?.toString()) {
      setHasEdited(true);
    }

    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <td 
      className="bg-[#F6F6F4] border border-[#E6E6E4] rounded-lg h-10 cursor-pointer group" 
      onClick={handleClick}
    >
      <div className="flex p-2 w-28 items-center justify-center relative">
        {isEditing ? (
          <>
          <input
            value={editedScore}
            onChange={(e) => setEditedScore(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-center bg-transparent focus:outline-none"
            autoFocus
          />
          {hasEdited && !isSaving && <span className="absolute right-5 top-0 bottom-0 flex items-center justify-center">
            <FaCheck className="text-green-500 text-sm" onClick={() => handleBlur()}/>
          </span>}
          </>
        ) : (
          <div className="flex items-center gap-1">
            <div className="font-semibold">
              {grade?.rawScore ?? "-"}
            </div>
            {!isEditing && !isSaving && <span className="absolute right-5 top-0 bottom-0 flex items-center justify-center">
              <FaPencilAlt className="text-gray-400 text-sm group-hover:block hidden" />
            </span>}
          </div>
        )}
      </div>
    </td>
  );
};

export default StudentGrade;
