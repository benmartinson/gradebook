import { useState } from "react";
import Sidebar from "./nav/Sidebar";
import classNames from "classnames";
import SettingsModal from "./SettingsModal";

const GradebookPage = ({ children }: { children: React.ReactNode }) => {
  const [isFullWidth, setIsFullWidth] = useState(
    localStorage.getItem('sidebarFullWidth') === 'true'
  );

  const pageClasses = classNames("bg-white rounded-xl shadow-lg flex-1 w-full mx-auto flex", {
    "max-w-[1500px]": !isFullWidth,
    "w-full": isFullWidth
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col p-8">
      <div className={pageClasses}>
        <Sidebar setIsFullWidth={setIsFullWidth} />
        <div className="flex-1 flex flex-col relative">
          <SettingsModal isFullWidth={isFullWidth} setIsFullWidth={setIsFullWidth}/>
          {children}
        </div>
      </div>
    </main>
  );
}

export default GradebookPage;
