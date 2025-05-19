import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

const ClassPage = () => {
  const { class_id } = useParams();
  const students = useQuery(api.students.getStudentsByClass, {
    classId: class_id as Id<"classes">,
  });

  return (
    <div className="p-6 w-2/3">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Summary</h1>
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
    </div>
  );
};

export default ClassPage;
