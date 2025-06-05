import React from "react";
import { FaPaperPlane } from "react-icons/fa";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        rows={2}
      />
      {message.trim() && (
        <button
          onClick={onSendMessage}
          disabled={isLoading}
          className="absolute bottom-2 right-2 bottom-3 px-3 py-1 h-8 text-sm bg-slate-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <FaPaperPlane />
        </button>
      )}
    </div>
  );
};

export default MessageInput;