import { FaUserCircle } from "react-icons/fa";
import { Student } from "../../../types";
import { useSettingValue } from "../../appStore";

const StudentInfo = ({ student }: { student: Student }) => {
  const showPhoto = useSettingValue("show_photo");
  console.log(showPhoto);
  return (
    <td className="min-h-10 h-10 pr-3">
      <div className="flex items-center gap-2 bg-white rounded-lg p-[2px]">
        {showPhoto && (
          <div className="text-gray-400">
            <FaUserCircle size={38} />
          </div>
        )}

        <div className="flex flex-col leading-[18px]">
          <span className="font-bold text-gray-800">{student.firstName}</span>
          <span className="text-gray-600">{student.lastName}</span>
        </div>
      </div>
    </td>
  );
};

export default StudentInfo;
