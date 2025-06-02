import classNames from "classnames";
import { FaExchangeAlt } from "react-icons/fa";
import ClassSwitchModal from "./ClassSwitchModal";
import { useState } from "react";

const ClassSwitcher = ({
  isCollapsed,
  loadingAnimation,
  classInfo,
}: {
  isCollapsed: boolean;
  loadingAnimation: boolean;
  classInfo: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonClasses = classNames(
    "p-2 rounded-lg h-10 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors cursor-pointer",
    {}
  );

  return (
    <>
      <button className={buttonClasses} onClick={() => setIsOpen(true)}>
        <FaExchangeAlt size={16} />
        {!isCollapsed && !loadingAnimation && (
          <span className="text-sm max-md:hidden font-medium">
            {classInfo?.classCode}
          </span>
        )}
      </button>
      <ClassSwitchModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentClass={classInfo}
      />
    </>
  );
};

export default ClassSwitcher;
