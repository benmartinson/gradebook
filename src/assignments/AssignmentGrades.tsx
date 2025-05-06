import { useQuery, useMutation } from "convex/react";
import { Assignment } from "../../types";
import { api } from "../../convex/_generated/api";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { getStudentGradesObject } from "../helpers";
import { useMemo, useState } from "react";
import StudentInfo from "../gradebook/grid/StudentInfo";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { Id } from "../../convex/_generated/dataModel";
import {
  FaComment,
  FaCommentAlt,
  FaComments,
  FaRegComment,
  FaRegFile,
  FaRegFileCode,
  FaRegFilePdf,
} from "react-icons/fa";

const completionStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "late", label: "Late" },
  { value: "incomplete", label: "Incomplete" },
  { value: "not_for_grade", label: "Not for Grade" },
];

const dropboxStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "turned_in", label: "Turned In" },
  { value: "not_turned_in", label: "Not Turned In" },
];

const AssignmentGrades = ({ assignment }: { assignment: Assignment }) => {
  const grades = useQuery(api.grades.getGrades);
  const students = useQuery(api.students.getStudents);
  const addGrade = useMutation(api.grades.addGrade);
  const updateGrade = useMutation(api.grades.updateGrade);
  const [publishedStates, setPublishedStates] = useState<
    Record<string, boolean>
  >({});
  const [editingGrades, setEditingGrades] = useState<Record<string, string>>(
    {}
  );

  const studentGrades = useMemo(() => {
    if (!grades || !students) {
      return [];
    }
    return getStudentGradesObject(grades, students, assignment);
  }, [grades, students]);

  const handlePublishedToggle = (studentId: string) => {
    setPublishedStates((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleGradeChange = (studentId: string, value: string) => {
    setEditingGrades((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleGradeBlur = async (studentId: string) => {
    const score = parseFloat(editingGrades[studentId]);
    if (!isNaN(score) && score >= 0) {
      const existingGrade = grades?.find(
        (g) => g.studentId === studentId && g.assignmentId === assignment._id
      );

      if (existingGrade) {
        await updateGrade({
          id: existingGrade._id as Id<"grades">,
          rawScore: score,
        });
      } else {
        await addGrade({
          studentId: studentId as Id<"students">,
          assignmentId: assignment._id as Id<"assignments">,
          rawScore: score,
        });
      }
    }
    setEditingGrades((prev) => {
      const newState = { ...prev };
      delete newState[studentId];
      return newState;
    });
  };

  if (!grades || !students) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 pt-0">
      <div className="flex flex-col w-full">
        {/* Headers */}
        <div className="flex border-b border-gray-300 p-4 font-light text-sm opacity-50">
          <div className="w-1/8"></div>
          <div className="w-1/6 flex items-center justify-center">Grade</div>
          <div className="w-1/6 flex items-center justify-center">
            Completion Status
          </div>
          <div className="w-1/6 flex items-center justify-center">
            Dropbox Status
          </div>
          <div className="w-1/8 flex items-center justify-center">
            Published
          </div>
          <div className="w-1/8 flex items-center justify-center">Feedback</div>
        </div>

        {/* Student Rows */}
        <div
          className="flex flex-col w-full h-[calc(100vh-250px)] overflow-y-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {studentGrades.map((student) => (
            <div
              key={student._id}
              className="flex border-t border-gray-300 p-4"
            >
              <div className="w-1/8">
                <StudentInfo student={student} />
              </div>
              <div className="w-1/6 flex items-center justify-center">
                <input
                  type="number"
                  className="w-16 px-2 py-1 border rounded text-center"
                  value={
                    editingGrades[student._id] ?? student.grade?.rawScore ?? ""
                  }
                  onChange={(e) =>
                    handleGradeChange(student._id, e.target.value)
                  }
                  onBlur={() => handleGradeBlur(student._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGradeBlur(student._id);
                    }
                  }}
                />
              </div>
              <div className="w-1/6 flex items-center justify-center">
                <Select
                  options={completionStatusOptions}
                  defaultValue={completionStatusOptions[0]}
                  className="w-40"
                  isSearchable={false}
                />
              </div>
              <div className="w-1/6 flex items-center justify-center">
                <Select
                  options={dropboxStatusOptions}
                  defaultValue={dropboxStatusOptions[0]}
                  className="w-40"
                  isSearchable={false}
                />
              </div>
              <div className="w-1/8 flex items-center justify-center">
                <Switch
                  checked={publishedStates[student._id] || false}
                  onChange={() => handlePublishedToggle(student._id)}
                  className={`${
                    publishedStates[student._id] ? "bg-blue-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      publishedStates[student._id]
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
              <div className="w-1/8 flex items-center justify-center">
                <FaRegComment className="text-gray-500 text-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentGrades;
