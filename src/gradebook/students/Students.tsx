import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import Table from '../common/Table';
import EditableTableRow, { FieldConfig } from '../common/EditableTableRow';
import { Student, TableColumn } from '../../../types';

const Students = () => {
  const students = useQuery(api.gradebook.getClassStudents);
  const addStudent = useMutation(api.gradebook.addStudent);
  const updateStudent = useMutation(api.gradebook.updateStudent);
  const [newStudents, setNewStudents] = useState<Array<Student & {isNew: boolean}>>([]);
  
  const handleSave = async (data: Student) => {
    // if (data.firstName.trim() && data.lastName.trim()) {
    //   if (data.isNew) {
    //     // Add new student
    //     await addStudent({ 
    //       firstName: data.firstName, 
    //       lastName: data.lastName 
    //     });
    //     // Remove from newStudents
    //     setNewStudents(newStudents.filter(s => s.id !== data.id));
    //   } else if ('_id' in data) {
    //     // Update existing student
    //     await updateStudent({
    //       id: data._id,
    //       firstName: data.firstName,
    //       lastName: data.lastName
    //     });
    //   }
    //   // Remove from editing state
    //   const newEditingIds = new Set(editingIds);
    //   newEditingIds.delete(data.id);
    //   setEditingIds(newEditingIds);
    // }
  };

  const handleCancel = (id: number, isNew: boolean) => {
    if (isNew) {
      // Remove new student
      setNewStudents(newStudents.filter(s => s.id !== id));
    }
  };

  const tableColumns: TableColumn[] = [
    { key: 'firstName', label: 'First Name', placeholder: 'First Name' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Last Name' },
    { key: 'grade', label: 'Class Grade', placeholder: '-' }
  ];

  // Combine existing students with new students for the list
  const allStudents = [...(students || []), ...newStudents];

  return (
    <div className="p-6 w-2/3">
      <Table<Student> 
        columns={tableColumns}
        list={students || []}
        listName="Students"
        emptyMessage="No students found"
      />
    </div>
  );
};

export default Students; 