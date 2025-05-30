import {
  FaBook,
  FaChevronLeft,
  FaChevronRight,
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
import ClassSwitcher from "./ClassSwitcher";
import UserMenu from "../../auth/UserMenu";

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
    "opacity-50": isDisabled,
    "cursor-pointer": !isDisabled,
  });

  return (
    <div onClick={() => !isDisabled && navigate(path)} className={tabClasses}>
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && !isLoadingAnimation && (
        <span className="max-md:hidden">{label}</span>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [loadingAnimation, setLoadingAnimation] = React.useState(false);

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

  const containerClasses = classNames(
    "flex md:flex-col max-md:gap-10 max-md:justify-center max-md:gap-4 max-md:w-full max-md:h-14 transition-all duration-300 bg-white md:border-r-2 max-md:border-b-2 border-gray-300 p-2 relative md:justify-between",
    {
      "md:w-48": !isCollapsed,
    }
  );

  return (
    <div className={containerClasses}>
      <div className="flex md:flex-col gap-6 md:gap-3">
        <ClassSwitcher
          isCollapsed={isCollapsed}
          loadingAnimation={loadingAnimation}
          classInfo={classInfo}
        />

        <button
          onClick={toggleCollapse}
          className="md:absolute max-md:hidden -right-[16px] top-2 rounded-full w-8 h-8 bg-white border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm cursor-pointer z-50"
        >
          {isCollapsed ? (
            <FaChevronRight size={16} />
          ) : (
            <FaChevronLeft size={16} />
          )}
        </button>

        <NavItem
          icon={<FaBook size={24} />}
          label="Gradebook"
          path={`/class/${class_id}/gradebook`}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "gradebook"}
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
          label="Reports"
          path={`/class/${class_id}/reports`}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "reports"}
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
      </div>

      <div className="max-md:hidden">
        <UserMenu
          isCollapsed={isCollapsed}
          loadingAnimation={loadingAnimation}
        />
      </div>
    </div>
  );
};

export default Sidebar;
