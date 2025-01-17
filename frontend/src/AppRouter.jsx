import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Accounts from "./Pages/Accounts";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Goals from "./Pages/Goals";
import ProtectedRoute from "./ProtectedRoute";
import Transactions from "./Pages/Transactions";
import PageNotFound from "./Pages/PageNotFound";

function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("token") !== null);
  }, []);

  // Use useLocation to get the current path dynamically
  const location = useLocation();
  const dashView = !["/home", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {dashView && <Sidebar setSidebarCollapsed={setSidebarCollapsed} />}
      {!dashView && (
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      <div
        className={
          (dashView ? (sidebarCollapsed ? "ml-64" : "ml-20") : "") +
          " transition-all duration-300 bg-gray-200 dark:bg-gray-900"
        }
      >
        <Routes>
          <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={Profile} />}
          />
          <Route
            path="/transactions"
            element={<ProtectedRoute element={Transactions} />}
          />
          <Route
            path="/accounts"
            element={<ProtectedRoute element={Accounts} />}
          />
          <Route path="/goals" element={<ProtectedRoute element={Goals} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

// Wrap AppRouter with Router to ensure useLocation works
export default function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}
