import React from "react";
import UserMenu from "../../auth/UserMenu";

const EmptySidebar = () => {
  const [isCollapsed] = React.useState(false);
  const [loadingAnimation] = React.useState(false);

  return (
    <div className="flex md:flex-col transition-all duration-300 bg-white md:border-r-2 border-gray-300 p-2 relative md:justify-end md:w-48">
      <div className="max-md:hidden">
        <UserMenu
          isCollapsed={isCollapsed}
          loadingAnimation={loadingAnimation}
        />
      </div>
    </div>
  );
};

export default EmptySidebar;
