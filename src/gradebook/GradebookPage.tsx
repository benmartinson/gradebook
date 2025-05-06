import { useState } from "react";
import Sidebar from "./nav/Sidebar";
import classNames from "classnames";
import SettingsModal from "./SettingsModal";

const GradebookPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen h-[100vh] bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="bg-white rounded-xl shadow-lg flex-1 w-full h-full mx-auto flex overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </main>
  );
};

export default GradebookPage;
