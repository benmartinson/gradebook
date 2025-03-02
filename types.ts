export type Assignment = {
  id: number;
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
  id: number;
  description: 'quiz' | 'exam' | 'project' | 'homework' | 'other';
  weight: number;
  color: string;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
};

export type AssignmentGrade = {
  studentId: number;
  assignmentId: number;
  rawScore: number;
};

export type TableColumn = {
  key: string;
  label: string;
  placeholder: string;
};


