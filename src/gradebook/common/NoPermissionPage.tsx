import GradebookPage from "../GradebookPage";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "../nav/Navbar";
import { Klass } from "../../../types";
import { FaLinkSlash } from "react-icons/fa6";

const EmptyPage = ({ message }: { message: string }) => {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col pb-4">
      <Navbar />
      <div className="flex flex-col items-center pt-20 h-full">
        <FaLinkSlash size={40} />
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default EmptyPage;
