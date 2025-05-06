import {
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaCompress,
  FaExpand,
  FaCompass,
  FaCalendarAlt,
  FaTasks,
  FaUsers,
  FaClipboardCheck,
  FaQuestionCircle,
  FaCog,
  FaExchangeAlt,
} from "react-icons/fa";
import React, { useEffect } from "react";
import classNames from "classnames";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isCollapsed: boolean;
  isSelected: boolean;
  isLoadingAnimation: boolean;
  isDisabled?: boolean;
}

const NavItem = ({
  icon,
  label,
  path,
  isCollapsed,
  isSelected,
  isLoadingAnimation,
  isDisabled,
}: NavItemProps) => {
  const navigate = useNavigate();

  const tabClasses = classNames("flex items-center gap-2 p-2 rounded", {
    "text-gray-600": !isSelected,
    "bg-blue-100": isSelected,
    "hover:bg-gray-100": !isSelected,
    "mt-4": label === "Gradebook",
    "opacity-50": isDisabled,
    "cursor-pointer": !isDisabled,
  });

  return (
    <div onClick={() => !isDisabled && navigate(path)} className={tabClasses}>
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && !isLoadingAnimation && <span>{label}</span>}
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [loadingAnimation, setLoadingAnimation] = React.useState(false);

  const navigate = useNavigate();
  const { class_id } = useParams();
  const classInfo = useQuery(api.classes.getClassInfo, {
    id: class_id as Id<"classes">,
  });
  const path = window.location.pathname;
  const selectedTab = path.split("/").pop() || "Gradebook";

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
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

  const containerClasses = classNames(
    "transition-all duration-300 bg-white border-r-2 border-gray-300 p-2 relative",
    {
      "w-16": isCollapsed,
      "w-48": !isCollapsed,
    }
  );

  const classSwitchClasses = classNames(
    "p-2 rounded-lg h-10 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors cursor-pointer",
    {
      "w-[90%]": !isCollapsed,
    }
  );

  return (
    <div className={containerClasses}>
      <button
        className={classSwitchClasses}
        onClick={() => navigate("/class-list")}
      >
        <FaExchangeAlt size={16} />
        {!isCollapsed && !loadingAnimation && (
          <span className="text-sm font-medium">{classInfo?.name}</span>
        )}
      </button>

      <button
        onClick={toggleCollapse}
        className="absolute -right-[16px] top-2 rounded-full w-8 h-8 bg-white border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm cursor-pointer z-50"
      >
        {isCollapsed ? (
          <FaChevronRight size={16} />
        ) : (
          <FaChevronLeft size={16} />
        )}
      </button>

      <nav className={navClasses}>
        <NavItem
          icon={<FaBook size={24} />}
          label="Gradebook"
          path={`/class/${class_id}/gradebook`}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "gradebook"}
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem
          icon={<FaTasks size={24} />}
          label="Assignments"
          path="/assignments"
          isDisabled={true}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "assignments"}
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem
          icon={<FaUsers size={24} />}
          label="Students"
          path={`/class/${class_id}/students`}
          isDisabled={false}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "students"}
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem
          icon={<FaClipboardCheck size={24} />}
          label="Attendance"
          path="/attendance"
          isDisabled={true}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "attendance"}
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem
          icon={<FaQuestionCircle size={24} />}
          label="Quizes"
          path="/quizes"
          isDisabled={true}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "quizes"}
          isLoadingAnimation={loadingAnimation}
        />
        <NavItem
          icon={<FaCog size={24} />}
          label="Settings"
          path="/settings"
          isDisabled={true}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "settings"}
          isLoadingAnimation={loadingAnimation}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
