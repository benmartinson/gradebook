import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";
import GradebookPage from "./gradebook/GradebookPage";
import NewAssignmentPage from "./assignments/NewAssignmentPage";
import UpdateAssignmentPage from "./assignments/UpdateAssignmentPage";
import Grid from "./gradebook/grid/Grid";
import Placeholder from "./gradebook/Placeholder";
import AssignmentPageContainer from "./assignments/AssignmentPageContainer";
import AdminDataFetcher from "./AdminDataFetcher";
import AuthWrapper from "./auth/AuthWrapper";
import { useAppStore } from "./appStore";
import { useEffect } from "react";
import AdminBadge from "./AdminBadge";
import ReportsPage from "./Reports/ReportsPage";
import BedrockTest from "./components/BedrockTest";

function AppRoutes() {
  const setParentDomain = useAppStore((state) => state.setParentDomain);
  const parentDomain = useAppStore((state) => state.parentDomain);
  const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlParentDomain = url.searchParams.get("parent_domain");
    if (urlParentDomain) {
      setParentDomain(urlParentDomain);
    }
  }, []);

  useEffect(() => {
    if (parentDomain) {
      const url = new URL(window.location.href);
      url.searchParams.set("parent_domain", parentDomain);
      window.history.replaceState({}, "", url);

      if (window.parent && typeof window.location.href === "string") {
        const newLocation = new URL(
          window.location.origin + window.location.pathname
        );
        window.parent.postMessage(newLocation.toString(), parentDomain);
      }
    }
  }, [location, parentDomain]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <GradebookPage>
            <AdminBadge />
            <BedrockTest />
            <Outlet />
          </GradebookPage>
        }
      >
        <Route index element={<Grid />} />
        <Route path="class/:class_id/gradebook" element={<Grid />} />
        <Route
          path="class/:class_id/assignment/:id/grades"
          element={<AssignmentPageContainer activeTab="grades" />}
        />
        <Route
          path="class/:class_id/assignment/:id"
          element={<AssignmentPageContainer activeTab="details" />}
        />
        <Route
          path="class/:class_id/new-assignment"
          element={<NewAssignmentPage />}
        />
        <Route
          path="class/:class_id/assignment/:assignment_id/update"
          element={<UpdateAssignmentPage />}
        />
        <Route path="class/:class_id/reports" element={<ReportsPage />} />
        <Route path="class/:class_id/settings" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <AdminDataFetcher />
      <BrowserRouter>
        <AuthWrapper>
          <AppRoutes />
        </AuthWrapper>
      </BrowserRouter>
    </>
  );
}
