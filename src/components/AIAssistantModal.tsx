import { useState } from "react";
import Modal from "../gradebook/common/Modal";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { buildContext } from "../helpers";

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

  const examples = [
    {
      cat: "Bulk Update",
      text: "Grades for test 1: Mark 99, Patrick 88, Leah: 50",
    },
    { cat: "Analytics", text: "Show class average for last week" },
    { cat: "Report", text: "Students with grades below 70%" },
  ];

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
    console.log({ context });

    try {
      const result = await getResponse({ message: userMessage, context });

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div
        className="bg-slate-50 rounded-lg -m-6 p-6"
        style={{ minHeight: "500px" }}
      >
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("examples")}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "examples"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Examples
          </button>
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
        </div>

        <div className="">
          {activeTab === "examples" ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Click any example to try it:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example.text)}
                    className="text-left p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                  >
                    <span className="text-xs font-medium text-gray-500">
                      {example.cat}
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {example.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col" style={{ height: "400px" }}>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-lg mb-2">Start a conversation!</p>
                    <p>
                      Ask me anything about grades, students, or assignments.
                    </p>
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

              <div className="">
                <div className="flex gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors self-end"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AIAssistantModal;
