import { useState } from "react";
import { FaSort, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import BackToScoresButton from "../BackToScoresButton";
import { useSettingValue, useAppStore } from "../../appStore";
import AIAssistantModal from "../../components/AIAssistantModal";
import { FaWandMagicSparkles } from "react-icons/fa6";

interface NavbarProps {
  showGridControls?: boolean;
  classData?: {
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

  const showDateOrder = useSettingValue("show_date_order_button");
  const allowAddAssignment = useSettingValue("allow_assignment_adding");

  return (
    <>
      <div className="flex w-full justify-end items-center py-2 md:border-b border-gray-200 h-14 px-4 min-h-14 bg-white">
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="text-blue-600 hover:text-blue-700 flex gap-1 items-center text-sm font-medium transition-colors duration-150 underline-offset-2 hover:underline focus:outline-none "
        >
          {!isAIModalOpen && (
            <>
              Open AI Assistant
              <FaWandMagicSparkles size={16} />
            </>
          )}
        </button>
      </div>

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        classData={classData}
      />
    </>
  );
};

export default Navbar;
