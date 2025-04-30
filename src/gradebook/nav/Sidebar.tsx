import { FaBook, FaChevronLeft, FaChevronRight, FaCompress, FaExpand, FaCompass, FaCalendarAlt, FaTasks, FaUsers, FaClipboardCheck, FaQuestionCircle, FaCog } from "react-icons/fa";
import React, { useEffect } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isCollapsed: boolean;
  isSelected: boolean;
  isLoadingAnimation: boolean;
}

const NavItem = ({ icon, label, path, isCollapsed, isSelected, isLoadingAnimation }: NavItemProps) => {
  const navigate = useNavigate();
  
  const tabClasses = classNames("flex items-center gap-2 p-2 rounded cursor-pointer", {
    "text-gray-600": !isSelected,
    "bg-blue-100": isSelected,
    "hover:bg-gray-100": !isSelected,
    "mt-4": label === "Gradebook",
  });

  return (
    <div onClick={() => navigate(path)} className={tabClasses}>
      <div className="shrink-0 cursor-pointer">{icon}</div>
      {!isCollapsed && !isLoadingAnimation && <span>{label}</span>}
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [loadingAnimation, setLoadingAnimation] = React.useState(false);

  const navigate = useNavigate();
  const path = window.location.pathname;
  const selectedTab = path.split("/").pop() || "Gradebook";

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setLoadingAnimation(true);
    setTimeout(() => {
      setLoadingAnimation(false);
    }, 100);
  };

  const navClasses = classNames("space-y-4 w-full", {
    "flex flex-col items-center": isCollapsed,
  });

  return (
    <div className={`transition-all duration-300 bg-white border-r-2 border-gray-300 p-2 relative ${isCollapsed ? 'w-16' : 'w-48'}`}>
      {/* <div className="flex items-center gap-2">
        <div className="flex items-center gap-2" onClick={() => navigate("/gradebook/class")}>
          {!isCollapsed && !loadingAnimation && (
            <h2 className="text-xl font-semibold">Calculus II</h2>
          )}
        </div>
        <button 
          onClick={toggleCollapse} 
          className="absolute -right-[16px] top-3 rounded-full w-8 h-8 bg-white border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm cursor-pointer z-50"
        >
          {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
      </div> */}

      <nav className={navClasses}>
        <NavItem 
          icon={<FaBook size={24} />} 
          label="Gradebook" 
          path="/gradebook" 
          isCollapsed={isCollapsed} 
          isSelected={selectedTab.toLowerCase() === "gradebook"} 
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem 
          icon={<FaTasks size={24} />} 
          label="Assignments" 
          path="/assignments" 
          isCollapsed={isCollapsed} 
          isSelected={selectedTab.toLowerCase() === "assignments"} 
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem 
          icon={<FaUsers size={24} />} 
          label="Students" 
          path="/students" 
          isCollapsed={isCollapsed} 
          isSelected={selectedTab.toLowerCase() === "students"} 
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem 
          icon={<FaClipboardCheck size={24} />} 
          label="Attendance" 
          path="/attendance" 
          isCollapsed={isCollapsed} 
          isSelected={selectedTab.toLowerCase() === "attendance"} 
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem 
          icon={<FaQuestionCircle size={24} />} 
          label="Quizes" 
          path="/quizes" 
          isCollapsed={isCollapsed} 
          isSelected={selectedTab.toLowerCase() === "quizes"} 
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem 
          icon={<FaCog size={24} />} 
          label="Settings" 
          path="/settings" 
          isCollapsed={isCollapsed} 
          isSelected={selectedTab.toLowerCase() === "settings"} 
          isLoadingAnimation={loadingAnimation}
        />
      </nav>
    </div>
  );
};

export default Sidebar; 