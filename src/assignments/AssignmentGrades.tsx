import { useQuery, useMutation } from "convex/react";
import { Assignment, Student, Grade } from "../../types";
import { api } from "../../convex/_generated/api";
import LoadingSpinner from "../gradebook/common/LoadingSpinner";
import { getStudentGradesObject, updateOrAddGrade } from "../helpers";
import { useMemo, useState } from "react";
import StudentInfo from "../gradebook/grid/StudentInfo";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { Id } from "../../convex/_generated/dataModel";
import { FaRegComment } from "react-icons/fa";

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

const AssignmentGrades = ({
  assignment,
  grades,
  students,
}: {
  assignment: Assignment;
  grades: Grade[];
  students: Student[];
}) => {
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
    await updateOrAddGrade(
      score,
      assignment._id,
      grades,
      studentId,
      addGrade,
      updateGrade
    );
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
        <div className="max-md:hidden border-b border-gray-300 p-4">
          <div
            className="grid font-light text-sm opacity-50 max-w-[1000px]"
            style={{
              gridTemplateColumns:
                "minmax(120px, 0.5fr) minmax(50px, 0.35fr) minmax(75px, 0.6fr) minmax(50px, 0.3fr) minmax(50px, 0.3fr) 0.25fr",
              gap: "4px",
            }}
          >
            <div className="text-left">Student</div>
            <div className="text-left flex items-center">Grade</div>
            <div className="text-left flex items-center">Completion Status</div>
            <div className="text-left flex items-center justify-center">
              Published
            </div>
            <div className="text-left flex items-center justify-center">
              Feedback
            </div>
            <div></div>
          </div>
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
              className="flex flex-col md:flex-row border-t border-gray-300 p-4"
            >
              {/* Desktop view */}
              <div className="hidden md:block w-full">
                <div
                  className="grid items-center  max-w-[1000px]"
                  style={{
                    gridTemplateColumns:
                      "minmax(120px, 0.5fr) minmax(50px, 0.35fr) minmax(75px, 0.6fr) minmax(50px, 0.3fr) minmax(50px, 0.3fr) 0.25fr",
                    gap: "4px",
                  }}
                >
                  <StudentInfo student={student} />
                  <div className="flex items-center">
                    <input
                      className="px-2 w-4/5 max-w-16 py-1 border rounded text-left"
                      value={
                        editingGrades[student._id] ??
                        student.grade?.rawScore ??
                        ""
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
                  <div className="flex items-center">
                    <Select
                      options={completionStatusOptions}
                      defaultValue={completionStatusOptions[0]}
                      className="w-4/5"
                      isSearchable={false}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Switch
                      checked={publishedStates[student._id] || false}
                      onChange={() => handlePublishedToggle(student._id)}
                      className={`${
                        publishedStates[student._id]
                          ? "bg-blue-600"
                          : "bg-gray-200"
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
                  <div className="flex items-center justify-center">
                    <FaRegComment className="text-gray-500 text-2xl" />
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Mobile view */}
              <div className="md:hidden flex flex-col w-full">
                <div className="font-medium text-lg mb-2">{`${student.firstName} ${student.lastName}`}</div>
                <div className="flex flex-col space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-light opacity-75 mb-1">
                      Grade
                    </span>
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded text-left"
                      value={
                        editingGrades[student._id] ??
                        student.grade?.rawScore ??
                        ""
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
                  <div className="flex flex-col">
                    <span className="text-sm font-light opacity-75 mb-1">
                      Completion Status
                    </span>
                    <Select
                      options={completionStatusOptions}
                      defaultValue={completionStatusOptions[0]}
                      className="w-full"
                      isSearchable={false}
                    />
                  </div>
                  <div className="flex flex-row justify-between mt-2">
                    <div className="flex items-center justify-between w-30">
                      <span className="text-sm font-light opacity-75">
                        Published
                      </span>
                      <Switch
                        checked={publishedStates[student._id] || false}
                        onChange={() => handlePublishedToggle(student._id)}
                        className={`${
                          publishedStates[student._id]
                            ? "bg-blue-600"
                            : "bg-gray-200"
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
                    <div className="flex items-center justify-between w-30">
                      <span className="text-sm font-light opacity-75">
                        Feedback
                      </span>
                      <FaRegComment className="text-gray-500 text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentGrades;
