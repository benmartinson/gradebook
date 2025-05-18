import { Assignment, Grade, Student } from "../types";

export const getStudentGradesObject = (
  grades: Grade[],
  students: Student[],
  assignment: Assignment
) => {
  return students.map((student) => {
    const studentGrade = grades.find(
      (grade) =>
        grade.studentId === student._id && grade.assignmentId === assignment._id
    );

    return {
      ...student,
      grade: studentGrade,
    };
  });
};

export const getStudentClassGrade = (
  grades: Grade[],
  student: Student,
  assignments: Assignment[]
) => {
  const assignmentGrades = grades
    .filter((grade) => grade.studentId === student._id)
    .map((grade) => {
      const assignment = assignments.find(
        (assignment) => assignment._id === grade.assignmentId
      );

      return {
        ...grade,
        weight: assignment?.weight ?? 100,
        maxPoints: assignment?.maxPoints ?? 100,
      };
    })
    .filter((grade) => grade.rawScore > 0);

  if (assignmentGrades.length === 0) {
    return "-";
  }

  const weightedSum = assignmentGrades.reduce(
    (acc, grade) =>
      acc + (grade.rawScore / grade.maxPoints) * 100 * grade.weight,
    0
  );

  const totalWeight = assignmentGrades.reduce(
    (acc, grade) => acc + grade.weight,
    0
  );

  return (weightedSum / totalWeight).toFixed(0);
};
