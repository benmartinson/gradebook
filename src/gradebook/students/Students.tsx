import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import Table from '../common/Table';
import { Student, TableColumn } from '../../../types';

const Students = () => {
  const students = useQuery(api.gradebook.getClassStudents);
  const addStudent = useMutation(api.gradebook.addClassStudent);
  const deleteStudent = useMutation(api.gradebook.deleteClassStudent);
  
  const handleAdd = async (data: Student) => {
    console.log({data});
    await addStudent({ 
      firstName: data.firstName, 
      lastName: data.lastName 
    });
  };

  const handleDelete = async (student: Student) => {
    await deleteStudent({ id: student._id as Id<'students'> });
  };

  const tableColumns: TableColumn[] = [
    { key: 'firstName', label: 'First Name', placeholder: 'First Name' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Last Name' },
    { key: 'grade', label: 'Class Grade', placeholder: '-' }
  ];

  const mappedStudents = students ? students.map(student => ({ ...student, isNew: false })) : [];

  return (
    <div className="p-6 w-2/3">
      <Table<Student & {isNew: boolean}> 
        columns={tableColumns}
        list={mappedStudents}
        listName="Students"
        emptyMessage="No students found for this class, add a student to get started."
        handleAdd={handleAdd}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Students; 