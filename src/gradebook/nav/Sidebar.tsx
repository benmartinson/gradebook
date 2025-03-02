import { FaBook, FaChevronLeft, FaChevronRight, FaCompress, FaExpand, FaCompass, FaCalendarAlt, FaTasks, FaUsers, FaClipboardCheck, FaQuestionCircle, FaCog } from "react-icons/fa";
import React, { useEffect } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();
  const path = window.location.pathname;
  const selectedTab = path.split("/").pop() || "Gradebook";

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const tabClasses = (tab: string) => {
    const isSelected = selectedTab.toLowerCase() === tab.toLowerCase();
    return classNames("flex items-center gap-2 p-2  rounded cursor-pointer", {
      "text-gray-600": !isSelected,
      "bg-blue-100": isSelected,
      "hover:bg-gray-100": !isSelected
    });
  };

  return (
    <div className={`transition-all duration-300 bg-white border-r-2 border-gray-300 p-4 relative ${isCollapsed ? 'w-16' : 'w-48'}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2" onClick={() => navigate("/gradebook/class")}>
          {!isCollapsed && (
            <h2 className="text-xl font-semibold">Calculus II</h2>
          )}
        </div>
        <button 
          onClick={toggleCollapse} 
          className="absolute -right-[16px] top-3 rounded-full w-8 h-8 bg-white border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm cursor-pointer z-50"
        >
          {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
      </div>
      
        <nav className="space-y-2">
          <div onClick={() => navigate("/gradebook")} className={tabClasses("Gradebook")}>
            <FaBook size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Gradebook</span>}
          </div>
          <div onClick={() => navigate("/schedule")} className={tabClasses("Schedule")}>
            <FaCalendarAlt size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Schedule</span>}
          </div>
          <div onClick={() => navigate("/assignments")} className={tabClasses("Assignments")}>
            <FaTasks size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Assignments</span>}
          </div>
          <div onClick={() => navigate("/students")} className={tabClasses("Students")}>
            <FaUsers size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Students</span>}
          </div>
          <div onClick={() => navigate("/attendance")} className={tabClasses("Attendance")}>
            <FaClipboardCheck size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Attendance</span>}
          </div>
          <div onClick={() => navigate("/quizes")} className={tabClasses("Quizes")}>
            <FaQuestionCircle size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Quizes</span>}
          </div>
          <div onClick={() => navigate("/settings")} className={tabClasses("Settings")}>
            <FaCog size={24} className="shrink-0 cursor-pointer" />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </nav>
    </div>
  );
};

export default Sidebar; 