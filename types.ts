export type Assignment = {
  id: string;
  description: string;
  assignmentType: number;
  weight: number;
  maxPoints: number;
  dueDate: string;
  assignedDate: string;
  notes: string;
  isExtraCredit: boolean;
};

export type AssignmentType = {
  id: string;
  description: 'quiz' | 'exam' | 'project' | 'homework' | 'other';
  weight: number;
  color: string;
};

export type Student = {
  _id: string;
  firstName: string;
  lastName: string;
};

export type AssignmentGrade = {
  studentid: string;
  assignmentid: string;
  rawScore: number;
};

export type TableItem = {
  id: string;
  isNew?: boolean;
};

export type TableColumn = {
  key: string;
  label: string;
  placeholder: string;
};


