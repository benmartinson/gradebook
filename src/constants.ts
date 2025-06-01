import { AssignmentType, TableColumn } from "../types";

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

export const tableDefs = ["classes", "assignments"];

export const tableColumns: Record<string, TableColumn[]> = {
  classes: [
    {
      key: "subject",
      label: "Subject",
      placeholder: "",
      width: "200px",
    },
    {
      key: "classCode",
      label: "Class Code",
      placeholder: "",
      width: "200px",
    },
    {
      key: "description",
      label: "Description",
      placeholder: "",
      width: "200px",
    },
    {
      key: "teacher",
      label: "Teacher",
      placeholder: "",
      width: "200px",
    },
    {
      key: "schoolYear",
      label: "School Year",
      placeholder: "",
      width: "200px",
    },
    {
      key: "startDate",
      label: "Start Date",
      placeholder: "",
      width: "200px",
    },
    {
      key: "endDate",
      label: "End Date",
      placeholder: "",
      width: "200px",
    },
  ],
};
