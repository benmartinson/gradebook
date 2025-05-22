import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import GradebookPage from "./gradebook/GradebookPage";
import NewAssignmentPage from "./assignments/NewAssignmentPage";
import Grid from "./gradebook/grid/Grid";
import Placeholder from "./gradebook/Placeholder";
import Assignments from "./assignments/Assignments";
import AssignmentPageContainer from "./assignments/AssignmentPageContainer";
import AdminDataFetcher from "./AdminDataFetcher";
import { useAppStore } from "./appStore";
import { useEffect } from "react";

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
        window.parent.postMessage(window.location.href, parentDomain);
      }
    }
  }, [location, parentDomain]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to="/class/jn7b7h4tb5vm4std60sfddkjfn7f9yb9/gradebook" />
          }
        />
        <Route
          path="/class/:class_id/gradebook"
          element={
            <GradebookPage>
              <Grid />
            </GradebookPage>
          }
        />
        <Route
          path="/attendance"
          element={
            <GradebookPage>
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/assignment/:id/grades"
          element={
            <GradebookPage>
              <AssignmentPageContainer activeTab="grades" />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/assignment/:id"
          element={
            <GradebookPage>
              <AssignmentPageContainer activeTab="details" />
            </GradebookPage>
          }
        />

        <Route
          path="class/:class_id/assignments"
          element={
            <GradebookPage>
              <Assignments />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/new-assignment"
          element={
            <GradebookPage>
              <NewAssignmentPage />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/schedule"
          element={
            <GradebookPage>
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/quizes"
          element={
            <GradebookPage>
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/settings"
          element={
            <GradebookPage>
              <Placeholder />
            </GradebookPage>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <>
      <AdminDataFetcher />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}
