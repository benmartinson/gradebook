import { useState, useEffect } from "react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { useAppStore } from "../appStore";

const adminConvexClient = new ConvexReactClient(
  import.meta.env.VITE_REACT_APP_ADMIN_URL
);

export function useAdminAuth() {
  const [adminSessionId, setAdminSessionId] = useState<string | null>(null);
  const [isValidatingAdmin, setIsValidatingAdmin] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const { setIsAdminAuthenticated, isAdminAuthenticated } = useAppStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("admin_session_id");
    if (sessionId) {
      setAdminSessionId(sessionId);
      validateAdminSession(sessionId);
    } else {
      setIsValidatingAdmin(false);
    }
  }, []);

  const validateAdminSession = async (sessionId: string) => {
    try {
      const validationResult = await adminConvexClient.query(
        "auth:validateSessionId" as any,
        { sessionId }
      );

      if (validationResult?.isValid) {
        setIsAdminAuthenticated(true);
        setAdminUser(validationResult.user);
      }
    } catch (error) {
      console.error("Failed to validate admin session:", error);
      setIsAdminAuthenticated(false);
    } finally {
      setIsValidatingAdmin(false);
    }
  };

  const clearAdminAuth = () => {
    setAdminSessionId(null);
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("admin_session_id");
    localStorage.removeItem("admin_user");
  };

  return {
    adminSessionId,
    isAdminAuthenticated,
    isValidatingAdmin,
    adminUser,
    clearAdminAuth,
  };
}
