import { useEffect, useState } from "react";
import GradebookPage from "./gradebook/GradebookPage";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";


export default function App() {
  return (
    <div>
      <GradebookPage />
    </div>
  );
}
