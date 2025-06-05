import { ReactMutation } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import { Assignment, Grade, Student } from "../types";
import { FunctionReference } from "convex/server";

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

export const buildContext = (classData: {
  className?: string;
  students?: Student[];
  assignments?: Assignment[];
  grades?: Grade[];
}) => {
  return `
  Current Class Information:
  - Class: ${classData.className || "Unknown"}
  - Number of Students: ${classData.students?.length || 0}
  - Number of Assignments: ${classData.assignments?.length || 0}
  
  Students in class:
  ${classData.students?.map((s) => `- ${s.firstName} ${s.lastName} (ID: ${s._id})`).join("\n") || "No students"}
  
  Assignments:
  ${classData.assignments?.map((a) => `- ${a.description} (ID: ${a._id}, Due: ${new Date(a.dueDate).toLocaleDateString()}, Max Points: ${a.maxPoints})`).join("\n") || "No assignments"}
  
  Grades:
  ${
    classData.grades
      ?.map((g) => {
        const student = classData.students?.find((s) => s._id === g.studentId);
        const assignment = classData.assignments?.find(
          (a) => a._id === g.assignmentId
        );
        return student && assignment
          ? `- ${student.firstName} ${student.lastName}: ${g.rawScore}/${assignment.maxPoints} on ${assignment.description}`
          : "";
      })
      .filter(Boolean)
      .join("\n") || "No grades"
  }
  `;
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

export const updateOrAddGrade = async (
  score: number,
  assignmentId: string,
  grades: Grade[],
  studentId: string,
  addGrade: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      {
        assignmentId: Id<"assignments">;
        rawScore: number;
        studentId: Id<"students">;
      },
      null,
      string | undefined
    >
  >,
  updateGrade: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      {
        id: Id<"grades">;
        rawScore: number;
      },
      null,
      string | undefined
    >
  >
) => {
  if (!isNaN(score) && score >= 0) {
    const existingGrade = grades?.find(
      (g) => g.studentId === studentId && g.assignmentId === assignmentId
    );

    if (existingGrade) {
      await updateGrade({
        id: existingGrade._id as Id<"grades">,
        rawScore: score,
      });
    } else {
      await addGrade({
        studentId: studentId as Id<"students">,
        assignmentId: assignmentId as Id<"assignments">,
        rawScore: score,
      });
    }
  }
};

export const getSystemPrompt = (context: string) => {
  return `You are an AI assistant for a gradebook application. You help teachers manage grades, students, and assignments.
  ${context ? `Here is the current class data:\n${context}` : ""}
  
  You can provide insights about student performance, help with grade calculations, answer questions about the class data, and help manage grades.
  Be helpful, concise, and professional in your responses. When referring to specific students or assignments, use the data provided above.
  
  You cannot help with anything else. You are only a gradebook assistant. If the user asks you to do something that is not related to the gradebook, you should say "I'm sorry, I can only help with gradebook related questions."
  
  You can also help with bulk updates of grades. When the user asks you to update grades, you MUST respond with ONLY a JSON object, nothing else. Do not include any explanatory text before or after the JSON.
  
  The response MUST start with { and be a valid JSON object with this exact structure:
  
  {
    "confirm": true,
    "changesRequested": [
      {
        "studentId": "actual_student_id",
        "studentName": "Student Full Name",
        "assignmentId": "actual_assignment_id", 
        "assignmentName": "Assignment Name",
        "grade": 99
      }
    ]
  }
  
  CRITICAL RULES:
  1. When updating grades, respond with ONLY the JSON object
  2. Do NOT include any text before the JSON
  3. Do NOT include any text after the JSON
  4. The response MUST start with the opening brace {
  5. Include the actual IDs from the class data (look for ID values in parentheses)
  6. Include both IDs and names for clarity
  `;
};
