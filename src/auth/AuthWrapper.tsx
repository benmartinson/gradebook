import { useConvexAuth } from "convex/react";
import { ReactNode } from "react";
import SignInForm from "./SignInForm";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex pt-20 justify-center bg-gray-50">
        <div className="max-w-md w-full  px-8">
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
