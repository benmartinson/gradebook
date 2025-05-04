import { FaPencilAlt } from "react-icons/fa";
import { Assignment } from "../../../types";
import { assignmentTypes } from "../../mocks";
import moment from "moment";
import { useNavigate, useParams } from "react-router";

const AssignmentInfo = ({ assignment }: { assignment: Assignment }) => {
  const { class_id } = useParams();
  const assignmentType = assignmentTypes.find(
    (type) => type.id === assignment.assignmentType
  );
  const color = assignmentType?.color;
  const navigate = useNavigate();

  return (
    <th className="">
      <div
        className="flex flex-col bg-[#fffde7] border border-[#fff176] rounded-lg p-2 w-28 h-24 group relative cursor-pointer"
        onClick={() =>
          navigate(`/class/${class_id}/assignment/${assignment._id}`)
        }
      >
        <div
          className={`text-xs uppercase font-semibold text-white bg-[#EB5160] w-fit px-1 mb-1 text-left`}
        >
          {assignmentType?.description}
        </div>
        <FaPencilAlt className="text-gray-400 text-sm group-hover:block absolute right-2 top-3 hidden group-hover:block" />

        <div className="text-sm font-extrabold text-gray-700 mb-2 text-left h-12 leading-[16px] overflow-hidden text-ellipsis line-clamp-3">
          {assignment.description}
        </div>

        <div className="text-xs opacity-50 text-left">
          {moment(assignment.dueDate).format("MMM D") || "N/A"}
        </div>
      </div>
    </th>
  );
};

export default AssignmentInfo;
