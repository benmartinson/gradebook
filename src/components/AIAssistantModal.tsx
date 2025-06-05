import { useEffect, useState } from "react";
import Modal from "../gradebook/common/Modal";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { buildContext } from "../helpers";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: {
    className?: string;
    students?: any[];
    assignments?: any[];
    grades?: any[];
  };
}

const AIAssistantModal = ({
  isOpen,
  onClose,
  classData,
}: AIAssistantModalProps) => {
  const [activeTab, setActiveTab] = useState<"examples" | "chat">("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const getResponse = useAction(api.chats.getResponse);
  const [isConfirming, setIsConfirming] = useState(false);
  const [changesRequested, setChangesRequested] = useState<any[]>([]);

  const examples = [
    {
      cat: "Bulk Update",
      text: "Grades for test 1: Mark 99, Patrick 88, Leah: 50",
    },
    { cat: "Analytics", text: "Show class average for last week" },
    { cat: "Report", text: "Students with grades below 70%" },
  ];

  useEffect(() => {
    // setMessages([]);
    setIsConfirming(false);
    setChangesRequested([]);

    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // if esc is pressed, close the modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    // scroll to the bottom of the messages
    const messagesContainer = document.querySelector(".messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleConfirmChanges = () => {
    console.log("confirming changes", changesRequested);
    onClose();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Build context string from class data
    let context = "";
    if (classData) {
      context = buildContext(classData);
    }

    try {
      const result = await getResponse({ message: userMessage, context });

      // Check if there's extracted data with confirmation
      if (result.data?.confirm && result.data?.changesRequested) {
        setIsConfirming(true);
        setChangesRequested(result.data.changesRequested);
      }

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the AI service. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setActiveTab("chat");
    setMessage(example);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-[100] sm:px-2 md:px-20 lg:px-60 h-screen py-10"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 rounded-lg p-4 md:p-6 overflow-hidden flex flex-col min-w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {!isConfirming && (
              <button
                onClick={() => setActiveTab("chat")}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "chat"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Chat
              </button>
            )}
            {isConfirming && (
              <button
                onClick={() => {}}
                className="py-2 px-4 rounded-lg font-medium transition-colors bg-white text-blue-600 shadow-sm"
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

        {!isConfirming && (
          <div className="flex-grow overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg messages-container">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>
                  Ask me anything about grades, students, or assignments. I can
                  also help you with bulk updates of grades. You will see a
                  confirmation of any changes before I make them.
                </p>
                <div className="flex flex-col mt-10 space-y-2 max-md:hidden">
                  {examples.map((example, idx) => (
                    <>
                      <span className="text-xs font-medium text-gray-500">
                        {example.cat}
                      </span>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {example.text}
                      </p>
                    </>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isConfirming && (
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg">
            <h3 className="font-semibold text-lg mb-4">
              Please confirm these grade changes:
            </h3>
            <div className="space-y-2">
              {changesRequested.map((change, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-sm">
                    <span className="font-medium">{change.student}</span> -{" "}
                    {change.assignment}:
                    <span className="ml-2 font-semibold text-blue-600">
                      {change.grade}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isConfirming && (
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              rows={2}
            />
            {message.trim() && (
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="absolute bottom-2 right-2 bottom-3 px-3 py-1 h-8 text-sm bg-slate-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <FaPaperPlane />
              </button>
            )}
          </div>
        )}

        {isConfirming && (
          <div
            className="flex justify-end cursor-pointer"
            onClick={handleConfirmChanges}
          >
            <button className="py-2 px-4 rounded-lg font-medium transition-colors bg-white text-blue-600 shadow-sm">
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantModal;
