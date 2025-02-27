import { Assignment, AssignmentGrade, AssignmentType, Student } from "../types";

export const grades: AssignmentGrade[] = [
  {
    studentId: 1,
    assignmentId: 1,
    rawScore: 95,
  },
];

export const assignments: Assignment[] = [
  {
    id: 1,
    description: "Derivatives",
    assignmentType: 1,
    weight: 100,
    maxPoints: 100,
    dueDate: '2025-01-01',
    assignedDate: '2025-01-01',
    notes: "Notes",
    isExtraCredit: false,
  },
  {
    id: 2,
    description: "Quiz 1",
    assignmentType: 1,
    weight: 100,
    maxPoints: 100,
    dueDate: '2025-01-01',
    assignedDate: '2025-01-01',
    notes: "Notes",
    isExtraCredit: false,
  },
];

export const students: Student[] = [
  {
    id: 1,
    firstName: "Jeff",
    lastName: "Hinton",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Marple",
  },
  {
    id: 3,
    firstName: "Jim",
    lastName: "Donovan",
  },
];

export const assignmentTypes: AssignmentType[] = [
  {
    id: 1,
    description: "quiz",
    color: "#EB5160",
    weight: 100,
  },
  {
    id: 2,
    description: "exam",
    color: "red",
    weight: 100,
  },
  {
    id: 3,
    description: "project",
    color: "green",
    weight: 100,
  },
  {
    id: 4,
    description: "homework",
    color: "yellow",
    weight: 100,
  },
  {
    id: 5,
    description: "other",
    color: "purple",
    weight: 100,
  },
];
