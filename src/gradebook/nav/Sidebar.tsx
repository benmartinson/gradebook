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

  const tabClasses = classNames(
    "flex items-center justify-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out",
    {
      "text-gray-400 hover:text-white bg-slate-700 hover:bg-slate-600":
        !isSelected,
      "bg-sky-600 text-white shadow-md": isSelected,
      "opacity-50 cursor-not-allowed": isDisabled,
      "cursor-pointer": !isDisabled,
    }
  );

  return (
    <div onClick={() => !isDisabled && navigate(path)} className={tabClasses}>
      <div className="shrink-0 w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      {!isCollapsed && !isLoadingAnimation && (
        <span className="max-sm:hidden text-sm font-medium">{label}</span>
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
    }, 200);
  };

  const containerClasses = classNames(
    "flex sm:flex-col max-sm:gap-10 max-sm:justify-center max-sm:w-full max-sm:h-16 transition-all duration-300 ease-in-out bg-slate-800 sm:border-r sm:border-slate-700 p-3 relative sm:justify-between",
    {
      "sm:w-60": !isCollapsed,
      "sm:w-16": isCollapsed,
    }
  );

  const iconClasses = classNames(
    "max-sm:hidden text-gray-400 hover:text-white flex items-center cursor-pointer rounded-md  transition-colors",
    {
      "justify-center": isCollapsed,
      "justify-end": !isCollapsed,
    }
  );

  return (
    <div className={containerClasses}>
      <div className="flex sm:flex-col gap-6 sm:gap-2">
        <div onClick={toggleCollapse} className={iconClasses}>
          {isCollapsed ? (
            <div className="bg-slate-700 p-2 rounded-md bg-slate-700 hover:bg-slate-600">
              <FaChevronRight size={20} />
            </div>
          ) : (
            <div className="bg-slate-700 p-2 rounded-md bg-slate-700 hover:bg-slate-600">
              <FaChevronLeft size={20} />
            </div>
          )}
        </div>
        <ClassSwitcher
          isCollapsed={isCollapsed}
          loadingAnimation={loadingAnimation}
          classInfo={classInfo}
        />
        <NavItem
          icon={<FaBook size={24} />}
          label="Gradebook"
          path={`/class/${class_id}/gradebook`}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "gradebook"}
          isLoadingAnimation={loadingAnimation}
        />
        {/* <NavItem
          icon={
            <FaQuestionCircle
              size={20}
              className={
                selectedTab.toLowerCase() === "reports"
                  ? "text-white"
                  : "text-gray-400"
              }
            />
          }
          label="Reports"
          path={`/class/${class_id}/reports`}
          isCollapsed={isCollapsed}
          isSelected={selectedTab.toLowerCase() === "reports"}
          isLoadingAnimation={loadingAnimation}
        /> */}
      </div>

      <div className="max-sm:hidden pb-2">
        <UserMenu
          isCollapsed={isCollapsed}
          loadingAnimation={loadingAnimation}
        />
      </div>
    </div>
  );
};

export default Sidebar;
