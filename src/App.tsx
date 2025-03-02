import { BrowserRouter, Routes, Route } from "react-router-dom";
import GradebookPage from "./gradebook/GradebookPage";
import NewAssignmentPage from "./gradebook/NewAssignmentPage";
import Grid from "./gradebook/grid/Grid";
import ClassPage from "./gradebook/ClassPage";
import Students from "./gradebook/students/Students";
import Placeholder from "./gradebook/Placeholder";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/gradebook" element={<GradebookPage><Grid /></GradebookPage>} />
          <Route path="/class" element={<GradebookPage><ClassPage /></GradebookPage>} />
          <Route path="/students" element={<GradebookPage><Students /></GradebookPage>} />
          <Route path="/attendance" element={<GradebookPage><Placeholder /></GradebookPage>} />
          <Route path="/assignments" element={<GradebookPage><Placeholder /></GradebookPage>} />
          <Route path="/schedule" element={<GradebookPage><Placeholder /></GradebookPage>} />
          <Route path="/quizes" element={<GradebookPage><Placeholder /></GradebookPage>} />
          <Route path="/settings" element={<GradebookPage><Placeholder /></GradebookPage>} />
      </Routes>
    </BrowserRouter>
  );
}
