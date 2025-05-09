import { Assignment, Grade, AssignmentType, Student } from "../types";

export const grades: Grade[] = [
  {
    _id: "1",
    studentId: "1",
    assignmentId: "1",
    rawScore: 95,
  },
];

export const assignments: Assignment[] = [
  {
    _id: "1",
    description: "Derivatives",
    assignmentType: 1,
    weight: 100,
    maxPoints: 100,
    dueDate: "2025-01-01",
    assignedDate: "2025-01-01",
    notes: "Notes",
    isExtraCredit: false,
  },
  {
    _id: "2",
    description: "Quiz 1",
    assignmentType: 1,
    weight: 100,
    maxPoints: 100,
    dueDate: "2025-01-01",
    assignedDate: "2025-01-01",
    notes: "Notes",
    isExtraCredit: false,
  },
];

export const students: Student[] = [
  {
    _id: "1",
    firstName: "Jeff",
    lastName: "Hinton",
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Marple",
  },
  {
    _id: "3",
    firstName: "Jim",
    lastName: "Donovan",
  },
];
