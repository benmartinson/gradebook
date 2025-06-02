import { useState } from "react";
import Select from "react-select";
import {
  FaSort,
  FaBookOpen,
  FaExchangeAlt,
  FaPlus,
  FaBars,
} from "react-icons/fa";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from "react-router-dom";
import { Id } from "../../../convex/_generated/dataModel";
import BackToScoresButton from "../BackToScoresButton";
import { useSettingValue, useAppStore } from "../../appStore";
import classNames from "classnames";

const Navbar = ({ showGridControls }: { showGridControls?: boolean }) => {
  const navigate = useNavigate();
  const { class_id } = useParams();
  const { dateOrderAsc, setDateOrderAsc, isLoading } = useAppStore();

  const showDateOrder = useSettingValue("show_date_order_button");
  const allowAddAssignment = useSettingValue("allow_assignment_adding");

  const barsIconClasses = classNames({
    "[clip-path:polygon(0%_100%,_100%_-20%,_100%_100%)]": dateOrderAsc,
    "[clip-path:polygon(0%_-20%,_100%_100%,_0%_100%)]": !dateOrderAsc,
  });

  return (
    <div className="flex w-full justify-end items-center py-2 md:border-b border-gray-200 h-14 px-4 min-h-14 bg-white">
      <div className="flex items-center gap-4">
        {showGridControls && showDateOrder && (
          <button
            className="flex items-center max-md:hidden gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors duration-150"
            onClick={() => setDateOrderAsc(!dateOrderAsc)}
          >
            <FaSort size={16} />
            <span>
              Date Order {dateOrderAsc ? "(Newest First)" : "(Oldest First)"}
            </span>
          </button>
        )}

        {showGridControls && allowAddAssignment && (
          <button
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-md px-3 py-1.5 h-9 text-sm font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
            onClick={() => navigate(`/class/${class_id}/new-assignment`)}
          >
            <FaPlus size={14} />
            <span>New Assignment</span>
          </button>
        )}
        {!showGridControls && !isLoading && (
          <div className="flex items-center gap-3">
            <BackToScoresButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
