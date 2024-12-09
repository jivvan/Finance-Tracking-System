// src/AppRouter.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("token") !== null);
  }, []);
  const path = window.location.pathname;
  const dashView = !["/", "/login", "/signup"].includes(path);
  return (
    <Router>
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
          " transition-all duration-300 bg-gray-200"
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
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
          <Route
            path="/goals"
            element={<ProtectedRoute element={Goals} />}
          />

          {/* <Route path="/what-is-finance-tracker" element={<WhatIsFinanceTracker />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/share" element={<Share />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default AppRouter;
