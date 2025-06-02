import { FaPencilAlt } from "react-icons/fa";
import { Assignment } from "../../../types";
import { assignmentTypes } from "../../constants";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import { Id } from "../../../convex/_generated/dataModel";

const AssignmentInfo = ({ assignment }: { assignment: Assignment }) => {
  const { class_id } = useParams();
  const assignmentType = assignmentTypes.find(
    (type) => type.id === assignment.assignmentType
  );
  const color = assignmentType?.color || "#6B7280"; // Default to gray if no color

  // Function to determine if a color is light or dark
  const isColorLight = (hexColor: string): boolean => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // HSP (Highly Sensitive Poo) equation
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp > 127.5;
  };

  const typeTextColor = isColorLight(color) ? "text-slate-700" : "text-white";

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col w-32 min-h-[130px] group relative cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out h-full">
      <div className="text-sm font-semibold text-slate-700 mb-1.5 leading-tight line-clamp-2 flex-grow">
        {assignment.description}
      </div>

      <div
        className={`text-xs font-medium w-fit px-2 py-0.5 rounded-full mb-2 ${typeTextColor}`}
        style={{ backgroundColor: color }}
      >
        {assignmentType?.description || "General"}
      </div>

      <div className="text-[10px] text-slate-600 mb-2 space-y-0.5">
        <div>
          Max:{" "}
          <span className="text-slate-700">
            {assignment.maxPoints ?? "N/A"}
          </span>
        </div>
        <div>
          Weight:{" "}
          <span className=" text-slate-700">
            {assignment.weight ? `${assignment.weight}%` : "N/A"}
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-500 mt-auto pt-1.5 border-t border-slate-100">
        Due: {moment(assignment.dueDate).format("MMM D") || "N/A"}
      </div>
    </div>
  );
};

export default AssignmentInfo;
