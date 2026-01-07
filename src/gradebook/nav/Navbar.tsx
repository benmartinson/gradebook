import { useState } from "react";
import { FaSort, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import BackToScoresButton from "../BackToScoresButton";
import { useSettingValue, useAppStore } from "../../appStore";
import AIAssistantModal from "../../components/AIAssistantModal";
import { CustomizationModal } from "../../customization/CustomizationModal";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi";
import { Id } from "../../../convex/_generated/dataModel";

interface NavbarProps {
  showGridControls?: boolean;
  classData?: {
    _id?: Id<"classes">;
    className?: string;
    students?: any[];
    assignments?: any[];
    grades?: any[];
  };
}

const Navbar = ({ showGridControls, classData }: NavbarProps) => {
  const navigate = useNavigate();
  const { class_id } = useParams();
  const { dateOrderAsc, setDateOrderAsc, isLoading } = useAppStore();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const showDateOrder = useSettingValue("show_date_order_button");
  const allowAddAssignment = useSettingValue("allow_assignment_adding");

  return (
    <>
      <div className="flex w-full justify-between items-center py-2 sm:border-b border-gray-200 h-14 px-4 min-h-14 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="text-blue-600 hover:text-blue-700 flex gap-1 items-center text-sm font-medium transition-colors duration-150 underline-offset-2 hover:underline focus:outline-none"
          >
            {!isAIModalOpen && (
              <div className="cursor-pointer flex gap-1">
                Class Assistant
                <FaWandMagicSparkles size={16} />
              </div>
            )}
          </button>

          <button
            onClick={() => setIsCustomizationOpen(true)}
            className="text-violet-600 hover:text-violet-700 flex gap-1 items-center text-sm font-medium transition-colors duration-150 underline-offset-2 hover:underline focus:outline-none"
          >
            <span>Customize UI</span>
            <HiSparkles size={16} />
          </button>
        </div>

        {/* <div className="flex items-center gap-4">
          {showGridControls && showDateOrder && (
            <button
              className="flex items-center max-sm:hidden gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors duration-150"
              onClick={() => setDateOrderAsc(!dateOrderAsc)}
            >
              <FaSort size={16} />
              <span>
                Date Order {dateOrderAsc ? "(Newest First)" : "(Oldest First)"}
              </span>
            </button>
          )}

          {showGridControls && allowAddAssignment && (
            <button
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-md px-3 py-1.5 h-9 text-sm font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
              onClick={() => navigate(`/class/${class_id}/new-assignment`)}
            >
              <FaPlus size={14} />
              <span>New Assignment</span>
            </button>
          )}
          {!showGridControls && !isLoading && (
            <div className="flex items-center gap-3">
              <BackToScoresButton />
            </div>
          )}
        </div> */}
      </div>

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        classData={classData}
      />

      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
      />
    </>
  );
};

export default Navbar;
