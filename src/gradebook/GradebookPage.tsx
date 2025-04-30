import { useState } from "react";
import Sidebar from "./nav/Sidebar";
import classNames from "classnames";
import SettingsModal from "./SettingsModal";

const GradebookPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col p-8">
      <div className='bg-white rounded-xl shadow-lg flex-1 w-full mx-auto flex w-[90vw]'>
        <Sidebar />
        <div className="flex-1 ">
          {children}
        </div>
      </div>
    </main>
  );
}

export default GradebookPage;
