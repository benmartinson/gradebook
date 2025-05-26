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
import AssignmentPageContainer from "./assignments/AssignmentPageContainer";
import AdminDataFetcher from "./AdminDataFetcher";
import AuthWrapper from "./auth/AuthWrapper";
import { useAppStore } from "./appStore";
import { useEffect, useState } from "react";
import AdminBadge from "./AdminBadge";
import NoClassesPage from "./gradebook/common/NoClassesPage";

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
    <>
      <Routes>
        <Route
          path="/"
          element={
            <GradebookPage>
              <AdminBadge />
              <Grid />
            </GradebookPage>
          }
        />
        <Route
          path="/class/:class_id/gradebook"
          element={
            <GradebookPage>
              <AdminBadge />
              <Grid />
            </GradebookPage>
          }
        />
        <Route
          path="/attendance"
          element={
            <GradebookPage>
              <AdminBadge />
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/assignment/:id/grades"
          element={
            <GradebookPage>
              <AdminBadge />
              <AssignmentPageContainer activeTab="grades" />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/assignment/:id"
          element={
            <GradebookPage>
              <AdminBadge />
              <AssignmentPageContainer activeTab="details" />
            </GradebookPage>
          }
        />

        <Route
          path="class/:class_id/new-assignment"
          element={
            <GradebookPage>
              <AdminBadge />
              <NewAssignmentPage />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/schedule"
          element={
            <GradebookPage>
              <AdminBadge />
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/quizes"
          element={
            <GradebookPage>
              <AdminBadge />
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="class/:class_id/settings"
          element={
            <GradebookPage>
              <AdminBadge />
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
        <AuthWrapper>
          <AppRoutes />
        </AuthWrapper>
      </BrowserRouter>
    </>
  );
}
