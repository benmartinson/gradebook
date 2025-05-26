import { useConvexAuth, useConvex } from "convex/react";
import { ReactNode, useEffect, useState } from "react";
import SignInForm from "./SignInForm";
import { useAdminAuth } from "./useAdminAuth";
import { api } from "../../convex/_generated/api";
import { useAppStore } from "../appStore";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../../convex/_generated/server";
import { Id } from "../../convex/_generated/dataModel";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isAdminAuthenticated, isValidatingAdmin } = useAdminAuth();
  const convex = useConvex();
  const classes = useAppStore((state) => state.classes);
  const setClasses = useAppStore((state) => state.setClasses);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const getTeacher = async () => {
        const teacher = await convex.query(api.teachers.getTeacher);
        if (!teacher) {
          return;
        }
        const classes = await convex.query(api.teachers.getTeacherClasses, {
          teacherId: teacher._id as Id<"teachers">,
        });
        if (classes) {
          setClasses(classes);
        }
        setIsLoadingClasses(false);
      };
      getTeacher();
    } else if (isAdminAuthenticated) {
      setIsLoadingClasses(false);
    }
  }, [isAuthenticated, convex]);

  if (isLoading || isValidatingAdmin || isLoadingClasses) {
    const message = isLoadingClasses ? "Loading Classes..." : "Signing in...";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex pt-20 justify-center bg-gray-50">
        <div className="max-w-md w-full px-8">
          <div className="text-center">
            <div className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to Gradebook
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Please sign in to access your gradebook
            </div>
          </div>
          <SignInForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
