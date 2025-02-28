import { BrowserRouter, Routes, Route } from "react-router-dom";
import GradebookPage from "./gradebook/GradebookPage";
import NewAssignmentPage from "./gradebook/NewAssignmentPage";
import Grid from "./gradebook/grid/Grid";
import ClassPage from "./gradebook/ClassPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/gradebook" element={<GradebookPage><Grid /></GradebookPage>} />
          <Route path="/gradebook/new" element={<GradebookPage><NewAssignmentPage /></GradebookPage>} />
          <Route path="/gradebook/class" element={<GradebookPage><ClassPage /></GradebookPage>} />
      </Routes>
    </BrowserRouter>
  );
}
