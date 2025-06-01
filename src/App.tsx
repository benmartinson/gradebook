import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";
import MainPage from "./gradebook/MainPage";
import NewAssignmentPage from "./assignments/NewAssignmentPage";
import Grid from "./gradebook/grid/Grid";
import Placeholder from "./UserHub/common/Placeholder";
import AssignmentPageContainer from "./assignments/AssignmentPageContainer";
import AdminDataFetcher from "./AdminDataFetcher";
import AuthWrapper from "./auth/AuthWrapper";
import { useAppStore } from "./appStore";
import { useEffect } from "react";
import AdminBadge from "./AdminBadge";
import ReportsPage from "./Reports/ReportsPage";
import { tableDefs } from "./constants";
import TablePage from "./UserHub/common/TablePage";

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
          <MainPage>
            <AdminBadge />
            <Outlet />
          </MainPage>
        }
      >
        <Route index element={<Placeholder />} />
        {tableDefs.map((tableDef) => (
          <Route
            key={tableDef}
            path={`${tableDef}`}
            element={<TablePage tableDef={tableDef} />}
          />
        ))}
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
