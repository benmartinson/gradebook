import Sidebar from "../UserHub/Sidebar";
import { useConvexAuth } from "convex/react";
import { useAdminAuth } from "../auth/useAdminAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Klass } from "../../types";

const MainPage = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useConvexAuth();
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAuthenticated && !isAdminAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-[650px] h-[100vh] bg-gradient-to-br from-indigo-50 to-blue-100 md:p-4 md:p-8">
      <div className="bg-white md:rounded-xl shadow-lg flex-1 w-full h-full mx-auto flex flex-col md:flex-row overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </main>
  );
};

export default MainPage;
