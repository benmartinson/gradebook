import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

const UserProfile = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const classes = classNames(
    "w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-dark font-semibold",
    {
      "cursor-default opacity-0": !isAuthenticated,
    }
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
    : "JD";

  return (
    <div className="relative z-20">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isAuthenticated}
        className={classes}
      >
        {userInitials}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-1 w-48 bg-light rounded-md shadow-lg py-1 border-2 border-slate-200 z-50"
        >
          <button
            onClick={() => {
              navigate("/account");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-dark hover:bg-slate-100"
          >
            Account
          </button>
          <button
            onClick={() => {
              void signOut();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-dark hover:bg-slate-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
