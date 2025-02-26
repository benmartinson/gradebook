import { Assignment } from "../../types";
import { assignmentTypes } from "../../mocks";
import moment from "moment";
const AssignmentInfo = ({ assignment }: { assignment: Assignment }) => {
  const assignmentType = assignmentTypes.find(type => type.id === assignment.assignmentType);
  const color = assignmentType?.color;

  return (
    <th className="">
      <div className="flex flex-col bg-[#F6F6F4] rounded-lg p-2 w-28 h-24">
        <div className={`text-xs uppercase font-semibold text-white bg-[#EB5160] w-fit px-1 mb-1 text-left`}>
          {assignmentType?.description}
        </div>
        
        <div className="text-sm font-extrabold text-gray-700 mb-2 text-left h-12">
          {assignment.description}
        </div>
        
        <div className="text-xs text-gray-600 text-left">
          {moment(assignment.dueDate).format("MMM D") || "N/A"}
        </div>
      </div>
    </th>
  );
};

export default AssignmentInfo;