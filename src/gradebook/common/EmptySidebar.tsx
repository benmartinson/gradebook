import React from "react";
import UserMenu from "../../auth/UserMenu";

const EmptySidebar = () => {
  const [isCollapsed] = React.useState(false);
  const [loadingAnimation] = React.useState(false);

  return (
    <div className="flex sm:flex-col transition-all duration-300 bg-slate-800 sm:border-r sm:border-slate-700 p-3 relative sm:justify-end sm:w-48">
      <UserMenu
        isCollapsed={isCollapsed}
        loadingAnimation={loadingAnimation}
      />
    </div>
  );
};

export default EmptySidebar;
