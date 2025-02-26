import { FaBook } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-6">
        <FaBook size={24} className="text-blue-600" />
        <h2 className="text-xl font-semibold">Calculus II</h2>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>Spring 2023</p>
        <p>Section 002</p>
        <p>MWF 10:00 - 11:15 AM</p>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="font-medium mb-2">Quick Stats</h3>
        <div className="text-sm">
          <p>Class Average: 87.3%</p>
          <p>Assignments: 24</p>
          <p>Students: 32</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 