import { useState } from "react";
import Navbar from "./nav/Navbar";
import Sidebar from "./nav/Sidebar";
import Grid from "./grid/Grid";

const GradebookPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col p-8">
      <div className="bg-white rounded-xl shadow-lg flex-1 max-w-[1500px] w-full mx-auto flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-4 overflow-auto">
            <Grid />
          </div>
        </div>
      </div>
    </main>
  );
}

export default GradebookPage;
