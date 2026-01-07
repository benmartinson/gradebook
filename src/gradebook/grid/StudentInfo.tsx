import { FaUserCircle } from "react-icons/fa";
import { Student } from "../../../types";
import { useSettingValue } from "../../appStore";

type StudentInfoProps = {
  student: Student;
  showInitials?: boolean; // Optional - if not provided, uses settings hook
};

const StudentInfo = ({ student, showInitials: showInitialsProp }: StudentInfoProps) => {
  const showPhoto = useSettingValue("show_photo");
  const showInitialsFromSettings = useSettingValue("show_initials_instead_of_photo");

  // Use prop if provided, otherwise fall back to settings
  const showInitials = showInitialsProp ?? showInitialsFromSettings;

  const initials = student.firstName.charAt(0) + student.lastName.charAt(0);

  return (
    <div className="flex items-center gap-2 pl-2 justify-start">
      {showInitials && (
        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
      )}
      <div className="flex gap-1">
        <span className="font-medium text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {student.firstName}
        </span>
        <span className=" text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
          {student.lastName}
        </span>
      </div>
    </div>
  );
};

export default StudentInfo;
