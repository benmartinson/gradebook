import classNames from "classnames";
import { FaBug, FaDatabase, FaEdit, FaHammer, FaPlus } from "react-icons/fa";

interface Report {
  type: "Bug" | "Data Change" | "Feature";
  description: string;
  date_reported: string;
  admin_comment: string;
  is_completed_by_admin: boolean;
}

const reportsData: Report[] = [
  {
    type: "Bug",
    description:
      "Clicking on the 'feedback' item doesn't work. I expected a popup to open but it doesn't go anywhere",
    date_reported: "02-02-2025",
    admin_comment: "",
    is_completed_by_admin: false,
  },
  {
    type: "Data Change",
    description:
      "I need a new class added called 'History of the United States', with the same students as in my Math Class",
    date_reported: "03-05-2025",
    admin_comment: "",
    is_completed_by_admin: false,
  },
  {
    type: "Feature",
    description:
      "It would be nice to have a way to input grades directly in the grid",
    date_reported: "01-25-2025",
    admin_comment:
      "Good idea, I have implemented it, let me know if you see any problems with it!",
    is_completed_by_admin: true,
  },
];

const ReportCard = ({ report }: { report: Report }) => {
  const getTypeColor = (type: Report["type"]) => {
    switch (type) {
      case "Bug":
        return "bg-red-400";
      case "Data Change":
        return "bg-yellow-400";
      case "Feature":
        return "bg-blue-400";
      default:
        return "bg-slate-400";
    }
  };

  const triangleClasses = classNames(getTypeColor(report.type));

  return (
    <div className="bg-white shadow-md rounded-lg px-6 py-4 mb-4 border border-slate-200 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center mb-2 gap-2">
          {report.type === "Bug" && <FaBug className={`text-red-400`} />}
          {report.type === "Data Change" && (
            <FaDatabase className={`text-gray-500`} />
          )}
          {report.type === "Feature" && (
            <FaHammer className={`text-blue-400`} />
          )}
          <div className="font-semibold text-slate-800">{report.type}</div>
          <span
            className={` px-3 py-1 text-xs font-semibold rounded-full ${
              report.is_completed_by_admin
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {report.is_completed_by_admin ? "Completed" : "Pending"}
          </span>
        </div>
        <span className=" text-sm text-slate-500">
          Reported: {report.date_reported}
        </span>
      </div>

      <div className="bg-slate-50 px-3 py-2 rounded-md mb-2 border border-slate-200">
        <p className="text-slate-700">"{report.description}"</p>
      </div>

      {report.admin_comment && (
        <div className="bg-slate-100 px-3 py-2 rounded-md ">
          <h3 className="font-semibold text-slate-700">Admin Comment:</h3>
          <p className="text-sm text-slate-600">"{report.admin_comment}"</p>
        </div>
      )}
    </div>
  );
};

const ReportsPage = () => {
  return (
    <div className="px-8 py-4 bg-slate-50 min-h-screen w-full overflow-y-auto">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <button className="bg-green-200 hover:bg-green-300 cursor-pointer font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
            <FaPlus />
          </button>
        </div>
        <p className="text-slate-400 text-sm">
          View existing reports or submit new ones. Use this page to report
          software bugs, request new features, or ask for data corrections.
        </p>
      </header>

      <div className="space-y-6">
        {reportsData.length > 0 ? (
          reportsData.map((report, index) => (
            <ReportCard key={index} report={report} />
          ))
        ) : (
          <p className="text-center text-slate-500">
            No reports submitted yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
