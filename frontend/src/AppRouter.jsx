// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import { Profile } from "./Pages/Profile";
import Header1TEMP from "./Components/Header1TEMP";
import Sidebar from "./Components/Sidebar";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Router>
      <Header1TEMP />
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={Profile} />}
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
