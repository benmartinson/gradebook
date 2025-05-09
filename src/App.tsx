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

export default function App() {
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
