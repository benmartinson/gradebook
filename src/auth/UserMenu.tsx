import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { api } from "../../convex/_generated/api";
import { useAdminAuth } from "./useAdminAuth";

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
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = () => {
    void signOut();
  };

  const userEmail =
    currentUser && typeof currentUser === "object" && "email" in currentUser
      ? (currentUser as any).email
      : null;
  const userName =
    currentUser && typeof currentUser === "object" && "name" in currentUser
      ? (currentUser as any).name
      : null;

  const userInitials = userName
    ? userName
        .split(" ")
        .map((name: string) => name[0])
        .join("")
    : userEmail
      ? userEmail.split("@")[0]
      : "U";

  if (isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="mt-auto pt-2 border-t border-gray-200">
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-start"
        } gap-2 p-2 text-white mb-2`}
      >
        <div className="shrink-0">
          <FaUser size={20} />
        </div>
        {!isCollapsed && !loadingAnimation && (
          <div className="max-sm:hidden">
            <div className="text-sm font-medium truncate">{userInitials}</div>
            {userEmail && userName && (
              <div className="text-xs text-gray-400 truncate">
                {userInitials}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className={`flex items-center gap-2 p-2 cursor-pointer ${
          isCollapsed ? "justify-center" : "justify-start"
        } rounded text-white hover:bg-red-50 hover:text-red-600 transition-colors w-full`}
      >
        <div className="shrink-0">
          <FaSignOutAlt size={20} />
        </div>
        {!isCollapsed && !loadingAnimation && (
          <span className="max-sm:hidden">Sign Out</span>
        )}
      </button>
    </div>
  );
}
