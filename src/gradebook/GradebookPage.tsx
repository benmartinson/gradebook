import Sidebar from "./nav/Sidebar";
import EmptySidebar from "./common/EmptySidebar";
import { Navigate, useParams } from "react-router-dom";
import { useAppStore } from "../appStore";
import { useConvex, useConvexAuth } from "convex/react";
import EmptyPage from "./common/NoPermissionPage";
import { useAdminAuth } from "../auth/useAdminAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Klass } from "../../types";

const GradebookPage = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useConvexAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const { class_id } = useParams();
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const isSignedIn = isAuthenticated || isAdminAuthenticated;
  const classes = useAppStore((state) => state.classes);
  const setClasses = useAppStore((state) => state.setClasses);
  const convex = useConvex();
  const isValidClass = useMemo(
    () =>
      classes && classes.length > 0 && classes.some((c) => c._id === class_id),
    [classes, class_id]
  );

  const getClasses = useCallback(async () => {
    let classes;
    if (isAdminAuthenticated) {
      classes = await convex.query(api.classes.getClasses);
    } else {
      const teacher = await convex.query(api.teachers.getTeacher);
      if (!teacher) {
        return;
      }
      classes = await convex.query(api.teachers.getTeacherClasses, {
        teacherId: teacher._id as Id<"teachers">,
      });
    }
    if (classes?.length > 0) {
      setClasses(classes as Klass[]);
    }
    setIsLoadingClasses(false);
  }, [isAdminAuthenticated, convex, setClasses]);

  useEffect(() => {
    if (isSignedIn) {
      getClasses();
    }
  }, [isSignedIn, getClasses, convex, setClasses]);

  const defaultClass = classes?.length
    ? classes.find((c) => c.isDefault) || classes[0]
    : null;

  if (!isAuthenticated && !isAdminAuthenticated) {
    return null;
  }

  if (!class_id) {
    if (defaultClass) {
      return <Navigate to={`/class/${defaultClass._id}/gradebook`} />;
    } else {
      children = (
        <EmptyPage message="No classes found. Please contact your administrator." />
      );
    }
  }

  if (isLoadingClasses) {
    const message = "Loading Classes...";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  if (!isValidClass) {
    children = (
      <EmptyPage message="You do not have permission to access this resource." />
    );
  }

  return (
    <main className="min-h-[650px] h-[100vh] bg-gradient-to-br from-indigo-50 to-blue-100 md:p-4">
      <div className="bg-white md:rounded-xl shadow-lg flex-1 w-full h-full mx-auto flex flex-col md:flex-row overflow-hidden">
        {isValidClass ? <Sidebar /> : <EmptySidebar />}
        {children}
      </div>
    </main>
  );
};

export default GradebookPage;
