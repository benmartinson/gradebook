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
  completionStatus?: string;
  dropboxStatus?: string;
};

export type AppSetting = {
  descriptionLabel: string;
  systemValue: string;
  category: string;
  appConfigId: string;
  enabled: boolean;
  teacherCanUpdate: boolean;
};

export type Enrollment = {
  _id: string;
  studentId: string;
  classId: string;
  schoolYear: number;
};

export type ClassStudent = {
  enrollmentId: string;
  studentId: string;
  classId: string;
  schoolYear: number;
  firstName: string;
  lastName: string;
};

export type Klass = {
  _id: string;
  name: string;
  endDate: string;
  startDate: string;
  classCode: string;
  isDefault?: boolean;
};

export type Teacher = {
  _id: string;
  firstName: string;
  lastName: string;
};

export type GradeChange = {
  action: "update";
  type: "grade";
  studentName?: string;
  student?: string;
  assignmentName?: string;
  assignment?: string;
  grade: number;
  studentId: string;
  assignmentId: string;
};

export type AssignmentChange = {
  action: "create" | "update" | "delete";
  type: "assignment";
  assignmentId?: string;
  assignmentName?: string;
  field?: string;
  value?: string;
  assignment?: {
    description: string;
    dueDate: string;
    maxPoints: number;
    weight: number;
    type?: number;
  };
};
