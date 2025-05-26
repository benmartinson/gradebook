import Sidebar from "./nav/Sidebar";
import EmptySidebar from "./common/EmptySidebar";
import { Navigate, useParams } from "react-router-dom";
import { useAppStore } from "../appStore";
import NoPermissionPage from "./common/NoPermissionPage";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import LoadingSpinner from "./common/LoadingSpinner";
import EmptyPage from "./common/NoPermissionPage";

const GradebookPage = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { class_id } = useParams();
  const teacherClasses = useAppStore((state) => state.classes);
  const isTeacherOfClass =
    class_id && teacherClasses.some((c) => c._id === class_id);
  const defaultClass =
    teacherClasses.length > 0
      ? teacherClasses.find((c) => c.isDefault) || teacherClasses[0]
      : null;

  if (!class_id) {
    if (defaultClass) {
      return <Navigate to={`/class/${defaultClass._id}/gradebook`} />;
    } else {
      return (
        <EmptyPage message="No classes found. Please contact your administrator." />
      );
    }
  }

  console.log({ isTeacherOfClass, class_id, defaultClass });
  if (!isTeacherOfClass) {
    if (isAuthenticated) {
      children = (
        <EmptyPage message="You do not have permission to access this resource." />
      );
    } else {
      children = <LoadingSpinner />;
    }
  }

  return (
    <main className="min-h-[650px] h-[100vh] bg-gradient-to-br from-indigo-50 to-blue-100 md:p-4 md:p-8">
      <div className="bg-white md:rounded-xl shadow-lg flex-1 w-full h-full mx-auto flex flex-col md:flex-row overflow-hidden">
        {isTeacherOfClass ? <Sidebar /> : <EmptySidebar />}
        {children}
      </div>
    </main>
  );
};

export default GradebookPage;
