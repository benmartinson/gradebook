import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import BackToScoresButton from './BackToScoresButton';

const ClassPage = () => {
  const students = useQuery(api.gradebook.getClassStudents);

  return (
    <div className="p-6 w-2/3">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Summary</h1>
        <BackToScoresButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium mb-3">Course Information</h2>
          <div className="text-sm text-gray-600">
            <p>Spring 2023</p>
            <p>Section 002</p>
            <p>MWF 10:00 - 11:15 AM</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium mb-3">Quick Stats</h2>
          <div className="text-sm text-gray-600">
            <p>Class Average: 87.3%</p>
            <p>Assignments: 24</p>
            <p>Students: 32</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Class Roster</h2>
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Last Name</th>
                <th className="text-left p-4">First Name</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{student.lastName}</td>
                  <td className="p-4">{student.firstName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassPage; 