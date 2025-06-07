import React from "react";

interface SuccessMessageProps {
  show: boolean;
  message?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ show, message = "Changes applied successfully!" }) => {
  if (!show) return null;

  return (
    <div className="flex justify-center items-center py-8">
      <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium">
        ✓ {message}
      </div>
    </div>
  );
};

export default SuccessMessage;