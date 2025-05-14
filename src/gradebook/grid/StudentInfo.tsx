import { FaUserCircle } from "react-icons/fa";
import { Student } from "../../../types";
import { useSettingValue } from "../../appStore";

const StudentInfo = ({ student }: { student: Student }) => {
  const showPhoto = useSettingValue("show_photo");
  const showInitials = useSettingValue("show_initials_instead_of_photo");

  const initials = student.firstName.charAt(0) + student.lastName.charAt(0);

  return (
    <td className="min-h-10 h-10 pr-3">
      <div className="flex items-center gap-2 bg-white rounded-lg p-[2px]">
        {showPhoto && (
          <div className="text-gray-400">
            {showInitials ? (
              <div className="w-[38px] h-[38px] bg-gray-400  rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{initials}</span>
              </div>
            ) : (
              <FaUserCircle size={38} />
            )}
          </div>
        )}

        <div className="flex flex-col leading-[18px]">
          <span className="block font-bold text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis">
            {student.firstName}
          </span>
          <span className="block text-gray-600 max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">
            {student.lastName}
          </span>
        </div>
      </div>
    </td>
  );
};

export default StudentInfo;
