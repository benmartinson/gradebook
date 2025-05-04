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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/gradebook" replace />} />
        <Route
          path="/gradebook"
          element={
            <GradebookPage>
              <Grid />
            </GradebookPage>
          }
        />
        <Route
          path="/class"
          element={
            <GradebookPage>
              <ClassPage />
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
          path="/assignment/:id/grades"
          element={
            <GradebookPage>
              <AssignmentPageContainer activeTab="grades" />
            </GradebookPage>
          }
        />
        <Route
          path="/assignment/:id"
          element={
            <GradebookPage>
              <AssignmentPageContainer activeTab="details" />
            </GradebookPage>
          }
        />

        <Route
          path="/assignments"
          element={
            <GradebookPage>
              <Assignments />
            </GradebookPage>
          }
        />
        <Route
          path="/new-assignment"
          element={
            <GradebookPage>
              <NewAssignmentPage />
            </GradebookPage>
          }
        />
        <Route
          path="/schedule"
          element={
            <GradebookPage>
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="/quizes"
          element={
            <GradebookPage>
              <Placeholder />
            </GradebookPage>
          }
        />
        <Route
          path="/settings"
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
