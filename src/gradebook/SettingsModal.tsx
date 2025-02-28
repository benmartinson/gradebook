import { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";

const SettingsModal = ({ isFullWidth, setIsFullWidth }: { isFullWidth: boolean, setIsFullWidth: (isFullWidth: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFullWidth = () => {
    setIsFullWidth(!isFullWidth);
  };

  useEffect(() => {
    localStorage.setItem('sidebarFullWidth', JSON.stringify(isFullWidth));
  }, [isFullWidth]);

  return (
    <>
      <button className="absolute top-2 right-4 p-2 text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <FaCog className="w-6 h-6" />
      </button>
      {isOpen && (
      <div className="absolute top-10 right-4 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Settings</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFullWidth} onChange={toggleFullWidth} className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-sm">Full Width</span>
          </label>
        </div>
      </div>
    )}
    </>
  );
};

export default SettingsModal;
