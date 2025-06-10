import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { buildContext } from "../helpers";
import ModalHeader from "./AIAssistant/ModalHeader";
import ChatMessages from "./AIAssistant/ChatMessages";
import MessageInput from "./AIAssistant/MessageInput";
import ConfirmationView, { Change } from "./AIAssistant/ConfirmationView";
import { GradeChange, AssignmentChange } from "../../types";
import SuccessMessage from "./AIAssistant/SuccessMessage";
import Examples from "./AIAssistant/Examples";
import { useSettingValue } from "../appStore";
import { isEqual } from "lodash";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: {
    _id?: Id<"classes">;
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
  const [successMessage, setSuccessMessage] = useState("");
  const getResponse = useAction(api.chats.getResponse);
  const bulkUpdateGrades = useMutation(api.grades.bulkUpdateGrades);
  const addAssignment = useMutation(api.assignments.addAssignment);
  const updateAssignment = useMutation(api.assignments.updateAssignment);
  const deleteAssignment = useMutation(api.assignments.deleteAssignment);
  const [isConfirming, setIsConfirming] = useState(false);
  const [changesRequested, setChangesRequested] = useState<any[]>([]);
  const allowAssignmentUpdate = useSettingValue("allow_assignment_update");
  const allowAssignmentCreation = useSettingValue("allow_assignment_creation");
  const allowAssignmentDeletion = useSettingValue("allow_assignment_deletion");
  const allowGradeUpdate = useSettingValue("allow_grade_update");
  const permissions = {
    allowAssignmentUpdate: allowAssignmentUpdate || false,
    allowAssignmentCreation: allowAssignmentCreation || false,
    allowAssignmentDeletion: allowAssignmentDeletion || false,
    allowGradeUpdate: allowGradeUpdate || false,
  };

  useEffect(() => {
    setMessages([]);
    setIsConfirming(false);
    setChangesRequested([]);
    setShowSuccess(false);
    setIsUpdating(false);
    setSuccessMessage("");

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

  const handleConfirmChanges = async (changesToConfirm: Change[]) => {
    setIsUpdating(true);
    const isConfirmAll = changesRequested.length === changesToConfirm.length;

    try {
      // Separate grade and assignment changes
      const gradeChanges = changesToConfirm.filter(
        (change): change is GradeChange => change.type === "grade"
      );
      const assignmentChanges = changesToConfirm.filter(
        (change): change is AssignmentChange => change.type === "assignment"
      );

      // Handle grade updates
      if (gradeChanges.length > 0) {
        const gradeUpdates = gradeChanges.map((change) => ({
          studentId: change.studentId as Id<"students">,
          assignmentId: change.assignmentId as Id<"assignments">,
          grade: change.grade,
        }));

        await bulkUpdateGrades({
          gradeUpdates,
        });
      }

      // Handle assignment operations
      for (const change of assignmentChanges) {
        if (change.action === "create" && change.assignment) {
          await addAssignment({
            description: change.assignment.description,
            assignmentType: change.assignment.type || 0,
            weight: change.assignment.weight,
            maxPoints: change.assignment.maxPoints,
            dueDate: change.assignment.dueDate,
            assignedDate: new Date().toISOString(),
            notes: "",
            classId: classData?._id as Id<"classes">,
            isExtraCredit: false,
          });
        } else if (
          change.action === "update" &&
          change.assignmentId &&
          change.field &&
          change.value
        ) {
          await updateAssignment({
            assignmentId: change.assignmentId as Id<"assignments">,
            field: change.field,
            value: change.value,
          });
        } else if (change.action === "delete" && change.assignmentId) {
          await deleteAssignment({
            id: change.assignmentId as Id<"assignments">,
          });
        }
      }

      if (isConfirmAll) {
        setSuccessMessage("Changes applied successfully!");
        setShowSuccess(true);
      } else {
        const changesLeftToConfirm = changesRequested.filter(
          (change) =>
            !changesToConfirm.some((requested) => isEqual(change, requested))
        );
        setChangesRequested(changesLeftToConfirm);
      }

      setTimeout(() => {
        if (isConfirmAll) {
          onClose();
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to update:", error);
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
      const result = await getResponse({
        message: userMessage,
        context,
      });
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

        {!isConfirming && (
          <ChatMessages messages={messages} isLoading={isLoading} />
        )}

        {isConfirming && (
          <ConfirmationView
            changesRequested={changesRequested}
            onConfirm={() => handleConfirmChanges(changesRequested)}
            onConfirmSingle={(change) => handleConfirmChanges([change])}
            onUpdateChange={(index, updatedChange) => {
              const newChanges = [...changesRequested];
              newChanges[index] = updatedChange;
              setChangesRequested(newChanges);
            }}
            isUpdating={isUpdating}
            showConfirm={!showSuccess}
            permissions={permissions}
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

        <SuccessMessage show={showSuccess} message={successMessage} />
      </div>
    </div>
  );
};

export default AIAssistantModal;
