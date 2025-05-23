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
    <div className="flex w-full justify-end items-center py-1  md:border-b-2 border-gray-200 h-12 -mr-4 pr-4 min-h-12">
      <div className="flex items-center gap-3">
        {showGridControls && showDateOrder && (
          <button
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm cursor-pointer"
            onClick={() => setDateOrderAsc(!dateOrderAsc)}
          >
            <div>Date Order</div>
            <FaBars size={16} className={barsIconClasses} />
          </button>
        )}

        {showGridControls && allowAddAssignment && (
          <button
            className="flex items-center gap-1 bg-white border-2 border-gray-500 hover:border-black text-gray-500 hover:text-black rounded-full px-3 py-1 h-7 text-sm cursor-pointer"
            onClick={() => navigate(`/class/${class_id}/new-assignment`)}
          >
            <FaPlus size={16} />
          </button>
        )}
        {!showGridControls && !isLoading && (
          <div className="flex items-center gap-2">
            <BackToScoresButton />
            <div className="w-px bg-gray-300"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
