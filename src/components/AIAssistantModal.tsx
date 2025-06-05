import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { buildContext } from "../helpers";
import ModalHeader from "./AIAssistant/ModalHeader";
import ChatMessages from "./AIAssistant/ChatMessages";
import MessageInput from "./AIAssistant/MessageInput";
import ConfirmationView from "./AIAssistant/ConfirmationView";
import SuccessMessage from "./AIAssistant/SuccessMessage";
import Examples from "./AIAssistant/Examples";

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const getResponse = useAction(api.chats.getResponse);
  const bulkUpdateGrades = useMutation(api.grades.bulkUpdateGrades);
  const [isConfirming, setIsConfirming] = useState(false);
  const [changesRequested, setChangesRequested] = useState<any[]>([]);
  const { class_id } = useParams();

  const examples = [
    {
      cat: "Bulk Update",
      text: "Grades for test 1: Mark 99, Patrick 88, Leah: 50",
    },
    { cat: "Analytics", text: "Show class average for last week" },
    { cat: "Report", text: "Students with grades below 70%" },
  ];

  const handleExampleClick = (example: string) => {
    setMessage(example);
  };

  useEffect(() => {
    setMessages([]);
    setIsConfirming(false);
    setChangesRequested([]);
    setShowSuccess(false);
    setIsUpdating(false);

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

  const handleConfirmChanges = async () => {
    if (changesRequested.length === 0) return;

    setIsUpdating(true);

    try {
      // Transform the data to match the expected format
      const gradeUpdates = changesRequested.map((change) => ({
        studentId: change.studentId as Id<"students">,
        assignmentId: change.assignmentId as Id<"assignments">,
        grade: change.grade,
      }));

      await bulkUpdateGrades({
        gradeUpdates,
      });

      setShowSuccess(true);

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to update grades:", error);
      setIsConfirming(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    let context = "";
    if (classData) {
      context = buildContext(classData);
    }

    try {
      const result = await getResponse({ message: userMessage, context });
      console.log("result", result);

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
        console.log("error", result);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.log("error", error);
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
        <ModalHeader isConfirming={isConfirming} onClose={onClose} />

        {!isConfirming &&
          (messages.length === 0 ? (
            <Examples examples={examples} />
          ) : (
            <ChatMessages messages={messages} isLoading={isLoading} />
          ))}

        {isConfirming && (
          <ConfirmationView
            changesRequested={changesRequested}
            onConfirm={handleConfirmChanges}
            isUpdating={isUpdating}
          />
        )}

        {!isConfirming && !showSuccess && (
          <MessageInput
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}

        <SuccessMessage show={showSuccess} />
      </div>
    </div>
  );
};

export default AIAssistantModal;
