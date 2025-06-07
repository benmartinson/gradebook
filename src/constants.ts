import { AssignmentType } from "../types";

export const assignmentTypes: AssignmentType[] = [
  {
    id: 0,
    description: "other",
    color: "purple",
    weight: 100,
  },
  {
    id: 1,
    description: "quiz",
    color: "#EB5160",
    weight: 100,
  },
  {
    id: 2,
    description: "exam",
    color: "#51EB60",
    weight: 100,
  },
  {
    id: 3,
    description: "project",
    color: "#EBE151",
    weight: 100,
  },
  {
    id: 4,
    description: "homework",
    color: "#5160EB",
    weight: 100,
  },
  {
    id: 5,
    description: "other",
    color: "purple",
    weight: 100,
  },
];

export const aiAssistantExamples = [
  {
    cat: "Bulk Update",
    text: "Grades for test 1: Mark 99, Patrick 88, Leah: 50",
  },
  { cat: "Analytics", text: "Show class average for last week" },
  { cat: "Report", text: "Students with grades below 70%" },
];
