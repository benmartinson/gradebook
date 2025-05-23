import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { api } from "../../convex/_generated/api";

interface UserMenuProps {
  isCollapsed: boolean;
  loadingAnimation: boolean;
}

export default function UserMenu({
  isCollapsed,
  loadingAnimation,
}: UserMenuProps) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.currentUser);

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = () => {
    void signOut();
  };

  // Safely access user properties
  const userEmail =
    currentUser && typeof currentUser === "object" && "email" in currentUser
      ? (currentUser as any).email
      : null;
  const userName =
    currentUser && typeof currentUser === "object" && "name" in currentUser
      ? (currentUser as any).name
      : null;

  return (
    <div className="mt-auto pt-4 border-t border-gray-200">
      {/* User Info */}
      <div className="flex items-center gap-2 p-2 text-gray-600 mb-2">
        <div className="shrink-0">
          <FaUser size={20} />
        </div>
        {!isCollapsed && !loadingAnimation && (
          <div className="max-md:hidden">
            <div className="text-sm font-medium truncate">
              {userName || userEmail || "User"}
            </div>
            {userEmail && userName && (
              <div className="text-xs text-gray-400 truncate">{userEmail}</div>
            )}
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 p-2 rounded text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
      >
        <div className="shrink-0">
          <FaSignOutAlt size={20} />
        </div>
        {!isCollapsed && !loadingAnimation && (
          <span className="max-md:hidden">Sign Out</span>
        )}
      </button>
    </div>
  );
}
