import { useState, useEffect } from "react";
import { useCustomization } from "./useCustomization";
import { HiSparkles, HiX, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationModal({ isOpen, onClose }: CustomizationModalProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { requestCustomization, isGenerating, error } = useCustomization();

  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setStatus("idle");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!message.trim() || isGenerating) return;

    const success = await requestCustomization(message.trim());
    if (success) {
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatus("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-[100] px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-500 to-purple-600">
          <div className="flex items-center gap-2 text-white">
            <HiSparkles className="w-5 h-5" />
            <h2 className="font-semibold">Customize Your Gradebook</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <HiCheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="text-lg font-medium text-slate-800">
                Customization Applied!
              </h3>
              <p className="text-slate-500 mt-1">
                Refresh to see your changes
              </p>
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <HiExclamationCircle className="w-12 h-12 text-red-500 mb-3" />
              <h3 className="text-lg font-medium text-slate-800">
                Something went wrong
              </h3>
              <p className="text-slate-500 mt-1">{error}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-4">
                Describe how you'd like to change the appearance of your gradebook.
                For example:
              </p>

              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>"Show last name first, then first name"</li>
                  <li>"Make student names bold and larger"</li>
                  <li>"Add a colored background to student initials"</li>
                </ul>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your customization..."
                className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                disabled={isGenerating}
                autoFocus
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <CgSpinner className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <HiSparkles className="w-4 h-4" />
                      Apply Customization
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
