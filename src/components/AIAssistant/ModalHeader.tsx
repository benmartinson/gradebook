import React from "react";
import { FaTimes } from "react-icons/fa";

interface ModalHeaderProps {
  isConfirming: boolean;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ isConfirming, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        {!isConfirming && (
          <button className="py-2 px-4 rounded-lg font-medium transition-colors bg-white text-blue-500 shadow-sm">
            AI Assistant
          </button>
        )}
        {isConfirming && (
          <button
            onClick={() => {}}
            className="py-2 px-4 rounded-lg font-medium transition-colors bg-white text-blue-500 shadow-sm"
          >
            Changes Requested
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center"
        aria-label="Close modal"
      >
        <FaTimes size={20} />
      </button>
    </div>
  );
};

export default ModalHeader;
