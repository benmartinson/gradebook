import { useState } from "react";
import Sidebar from "./nav/Sidebar";
import classNames from "classnames";
import SettingsModal from "./SettingsModal";

const GradebookPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-[650px] h-[100vh] bg-gradient-to-br from-indigo-50 to-blue-100 md:p-4 md:p-8">
      <div className="bg-white md:rounded-xl shadow-lg flex-1 w-full h-full mx-auto flex flex-col md:flex-row overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </main>
  );
};

export default GradebookPage;
