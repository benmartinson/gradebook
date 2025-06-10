import { ReactMutation } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import { Assignment, Grade, Student } from "../types";
import { FunctionReference } from "convex/server";
import moment from "moment";

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

export const getSystemPrompt = (
  context: string,
  permissions: {
    allowAssignmentUpdate: boolean;
    allowAssignmentCreation: boolean;
    allowAssignmentDeletion: boolean;
    allowGradeUpdate: boolean;
  }
) => {
  return `You are an Class assistant for a gradebook application. You help teachers manage grades, students, and assignments.
  ${context ? `Here is the current class data:\n${context}` : ""}
  
  There are two types of user requests: questions and actions.

  Questions:
  - Questions are requests for information about the class data.
  - You can answer questions about the class data, grades, student performance, and assignment data.
  - You can also help with grade calculations.
  
  Actions:
  - Actions are requests to update the class data.
  - You can only help with actions if the user has permission to do so. More on that below.
  
  Be helpful, concise, and professional in your responses. When referring to specific students or assignments, use the data provided above.
  
  You cannot help with anything else. You are only a gradebook assistant. If the user asks you to do something that is not related to the gradebook, you should say "I'm sorry, I can only help with gradebook related questions."
  
  Actions Allowed:
  ${permissions.allowAssignmentCreation ? "- Create Assignments is allowed" : ""}
  ${permissions.allowAssignmentUpdate ? "- Update assignments is allowed" : ""}
  ${permissions.allowAssignmentDeletion ? "- Delete assignments is allowed" : ""}
  ${permissions.allowGradeUpdate ? "- Update grades is allowed" : ""}

  Actions NOT Permitted:
  ${!permissions.allowAssignmentCreation ? "- Create Assignments is not permitted" : ""}
  ${!permissions.allowAssignmentUpdate ? "- Update assignments is not permitted" : ""}
  ${!permissions.allowAssignmentDeletion ? "- Delete assignments is not permitted" : ""}
  ${!permissions.allowGradeUpdate ? "- Update grades is not permitted" : ""}

  If the user asks you do an action that is not permitted, you can reply with "I'm sorry, I can't perform that action." Even if 
  part of the action is allowed, you can't do it. So if the user asks you to create an assignment and update a grade, if grade update is
  allowed, but assignment creation is not, you can't do it, reply with "I'm sorry, I can't perform that action."

  If the user asks you to do an action that is allowed, you MUST respond with ONLY a JSON object, nothing else. Do not include any explanatory text before or after the JSON.
  The response MUST start with { and be a valid JSON object with this exact structure:
  
  Example action responses:

  - Create an assignment (assignments have a description, due date, max points, and weight, default to these values if the user does not provide them):
  {
    "confirm": true,
    "changesRequested": [
      {
        "action": "create",
        "type": "assignment",
        "assignment": {
          "description": "New Assignment",
          "type": 1, // 1 is quiz, 2 is exam, 3 is project, 4 is homework
          "dueDate": ${moment().add(1, "day").format("YYYY-MM-DD")},
          "maxPoints": 100,
          "weight": 100
        }
      }
    ]
  }

  - Update an assignment:
  {
    "confirm": true,
    "changesRequested": [
      {
        "action": "update",
        "type": "assignment",
        "field": "updated_field_name",
        "value": "updated_value",
        "assignmentId": "actual_assignment_id",
        "assignmentName": "Assignment Name",
      }
    ]
  }

  - Delete an assignment:
  {
    "confirm": true,
    "changesRequested": [
      {
        "action": "delete",
        "type": "assignment",
        "assignmentId": "actual_assignment_id",
        "assignmentName": "Assignment Name"
      }
    ]
  }

  - Update a grade:
  {
    "confirm": true,
    "changesRequested": [
      {
        "action": "update",
        "type": "grade",
        "studentId": "actual_student_id",
        "studentName": "Student Full Name",
        "assignmentId": "actual_assignment_id", 
        "assignmentName": "Assignment Name",
        "grade": 99
      }
    ]
  }

  - Bulk update grades (user asked for 3 grades to update, can be more or less, can be for more than one assignment):
  {
    "confirm": true,
    "changesRequested": [
      {
        "action": "update",
        "type": "grade",
        "assignmentName": "Assignment Name",
        "studentId": "actual_student_id",
        "studentName": "Student Full Name",
        "assignmentId": "actual_assignment_id",
        "grade": 99
      },
      {
        "action": "update",
        "type": "grade",
        "assignmentName": "Assignment Name",
        "studentId": "actual_student_id",
        "studentName": "Student Full Name",
        "assignmentId": "actual_assignment_id",
        "grade": 88
      },
      {
        "action": "update",
        "type": "grade",
        "assignmentName": "Assignment Name",
        "studentId": "actual_student_id",
        "studentName": "Student Full Name",
        "assignmentId": "actual_assignment_id",
        "grade": 77
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
