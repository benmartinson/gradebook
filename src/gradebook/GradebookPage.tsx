import { useState } from "react";
import { Navbar } from "./Navbar";

export const GradebookPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col p-8">
      <div className="bg-white rounded-xl shadow-lg flex-1 p-6 w-full mx-auto">
        <Navbar />
      </div>
    </main>
  );
}

export default GradebookPage;
