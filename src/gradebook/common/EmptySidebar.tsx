import React from "react";
import UserMenu from "../../auth/UserMenu";

const EmptySidebar = () => {
  const [isCollapsed] = React.useState(false);
  const [loadingAnimation] = React.useState(false);

  return (
    <div className="flex sm:flex-col transition-all duration-300 bg-white sm:border-r-2 border-gray-300 p-2 relative sm:justify-end sm:w-48">
      <div className="max-sm:hidden">
        <UserMenu
          isCollapsed={isCollapsed}
          loadingAnimation={loadingAnimation}
        />
      </div>
    </div>
  );
};

export default EmptySidebar;
