import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc, Id } from '../../convex/_generated/dataModel';
import Table from '../gradebook/common/Table';
import { Assignment, TableColumn } from '../../types';

const Assignments = () => {
  const assignments = useQuery(api.gradebook.getAssignments);
  const addAssignment = useMutation(api.gradebook.addAssignment);
  
  const handleAdd = async (data: Assignment) => {
    await addAssignment({ 
      description: data.description,
      assignmentType: data.assignmentType,
      weight: data.weight,
      maxPoints: data.maxPoints,
      dueDate: data.dueDate,
      assignedDate: data.assignedDate,
      notes: data.notes || '',
      isExtraCredit: data.isExtraCredit || false
    });
  };

  const tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', placeholder: 'Assignment description', width: 'min-w-40 max-w-40' },
    { key: 'assignmentType', label: 'Type', placeholder: 'Type', width: 'min-w-20 max-w-20' },
    { key: 'weight', label: 'Weight', placeholder: '0', width: 'min-w-16 max-w-16' },
    { key: 'maxPoints', label: 'Max Points', placeholder: '100', width: 'min-w-20 max-w-20' },
    { key: 'dueDate', label: 'Due Date', placeholder: 'YYYY-MM-DD', width: 'min-w-24 max-w-24' },
    { key: 'assignedDate', label: 'Assigned Date', placeholder: 'YYYY-MM-DD', width: 'min-w-24 max-w-24' },
    { key: 'isExtraCredit', label: 'Extra Credit', placeholder: 'false', width: 'min-w-20 max-w-20' }
  ];

  const mappedAssignments = assignments ? assignments.map(assignment => ({ 
    ...assignment, 
    isNew: false,
    id: assignment._id
  })) : [];

  return (
    <div className="p-6 w-full">
      <Table<Assignment & {isNew: boolean}> 
        columns={tableColumns}
        list={mappedAssignments}
        listName="Assignments"
        emptyMessage="No assignments found. Add an assignment to get started."
        handleAdd={handleAdd}
      />
    </div>
  );
};

export default Assignments;
