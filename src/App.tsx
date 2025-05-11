import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GradebookPage from "./gradebook/GradebookPage";
import NewAssignmentPage from "./assignments/NewAssignmentPage";
import Grid from "./gradebook/grid/Grid";
import ClassPage from "./gradebook/ClassPage";
import Students from "./gradebook/students/Students";
import Placeholder from "./gradebook/Placeholder";
import Assignments from "./assignments/Assignments";
import AssignmentPage from "./assignments/AssignmentDetails";
import AssignmentPageContainer from "./assignments/AssignmentPageContainer";
import AssignmentGrades from "./assignments/AssignmentGrades";
import { ConvexReactClient } from "convex/react";
import { api as mainApi } from "../convex/_generated/api";
import { useEffect } from "react";
import { useAppStore } from "./appStore";

const otherAppUrl = "https://festive-grouse-756.convex.cloud";

const convexOtherApp = new ConvexReactClient(otherAppUrl);
async function fetchDataFromOtherApp() {
  try {
    const appSettings = await convexOtherApp.query(
      "appSetting:getAppSettingsByAppConfigId" as any,
      { appConfigId: "kd7d796ngp0zgax7c82qtq4fvd7fnxyr" }
    );
    console.log(appSettings);
    return appSettings;
  } catch (error) {
    console.error("Failed to fetch from other app:", error);
    throw error;
  }
}

export default function App() {
  const setSettings = useAppStore((state) => state.setSettings);
  useEffect(() => {
    const fetchData = async () => {
      const settings = await fetchDataFromOtherApp();
      setSettings(settings);
    };
    fetchData();
  }, [setSettings]);

  return (
    <BrowserRouter>
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
          path="/students"
          element={
            <GradebookPage>
              <Students />
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
    </BrowserRouter>
  );
}
