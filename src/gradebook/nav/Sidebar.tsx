import { FaBook, FaChevronLeft, FaChevronRight, FaCompress, FaExpand } from "react-icons/fa";
import React, { useEffect } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const bookIconClasses = classNames("text-blue-600 shrink-0 cursor-pointer", {
    // "mt-10": isCollapsed
  });

  return (
    <div className={`transition-all duration-300 bg-white border-r border-gray-200 p-4 relative ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2" onClick={() => navigate("/gradebook/class")}>
          <FaBook size={24} className={bookIconClasses} />
          {!isCollapsed && (
            <h2 className="text-xl font-semibold">Calculus II</h2>
          )}
        </div>
        <button 
          onClick={toggleCollapse} 
          className="absolute -right-4 top-3 rounded-full w-8 h-8 bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm cursor-pointer z-50"
        >
          {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <nav className="space-y-2">
          {/* Add navigation items here */}
        </nav>
      )}
    </div>
  );
};

export default Sidebar; 