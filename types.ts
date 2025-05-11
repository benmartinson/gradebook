export type Assignment = {
  _id: string;
  description: string;
  assignmentType: AssignmentType["id"];
  weight: number;
  maxPoints: number;
  dueDate: string;
  assignedDate: string;
  notes: string;
  isExtraCredit: boolean;
};

export type AssignmentType = {
  id: number;
  description: "quiz" | "exam" | "project" | "homework" | "other";
  weight: number;
  color: string;
};

export type Student = {
  _id: string;
  firstName: string;
  lastName: string;
};

export type TableItem = {
  id: string;
  isNew?: boolean;
};

export type TableColumn = {
  key: string;
  label: string;
  placeholder: string;
  width?: string;
  type?: "number" | "text" | "date" | "checkbox";
};

export type Grade = {
  _id: string;
  studentId: string;
  assignmentId: string;
  rawScore: number;
};

export type AppSetting = {
  descriptionLabel: string;
  systemValue: string;
  category: string;
  appConfigId: string;
  enabled: boolean;
  teacherCanUpdate: boolean;
};
