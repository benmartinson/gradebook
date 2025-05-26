import Modal from "../common/Modal";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../appStore";

const ClassSwitchModal = ({
  isOpen,
  setIsOpen,
  currentClass,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentClass: any;
}) => {
  const classes = useAppStore((state) => state.classes);
  const navigate = useNavigate();
  const onClose = () => {
    setIsOpen(false);
  };

  const handleClassSwitch = (classId: string) => {
    setIsOpen(false);
    navigate(`/class/${classId}/gradebook`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Switch Class">
      <div className="py-2 max-h-[60vh] overflow-y-auto">
        {classes === undefined ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse w-8 h-8 rounded-full border-4 border-gray-300 border-t-slate-500"></div>
          </div>
        ) : classes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No classes available</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {classes
              .filter(
                (classItem) =>
                  currentClass && classItem._id !== currentClass._id
              )
              .map((classItem) => (
                <button
                  key={classItem._id}
                  onClick={() => handleClassSwitch(classItem._id)}
                  className="cursor-pointer flex items-center p-4 rounded-lg bg-white hover:bg-slate-50 border border-gray-200 transition-colors duration-150 text-left"
                >
                  <div className="flex-shrink-0 w-fit px-2 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-3">
                    {classItem.classCode}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {classItem.startDate} - {classItem.endDate}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClassSwitchModal;
