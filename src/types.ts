export interface Assignment {
  _id: string;
  description: string;
  assignmentType: string;
  weight: number;
  maxPoints: number;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  assignedDate: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  isExtraCredit?: boolean;
} 