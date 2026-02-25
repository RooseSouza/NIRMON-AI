import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import InputParameter from "../pages/InputParameter";
import Login from "../pages/Login";
import Users from "../pages/Users";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* 1️⃣ Public Route */}
      <Route path="/login" element={<Login />} />

      {/* 2️⃣ Protected Routes */}
      <Route element={<ProtectedRoute />}>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Projects */}
        <Route path="/projects" element={<Projects />} />

        {/* Create Project */}
        <Route path="/projects/new" element={<NewProject />} />

        {/* ✅ VERY IMPORTANT ROUTE (YOU WERE MISSING THIS) */}
        <Route
          path="/projects/:projectId/parameters"
          element={<InputParameter />}
        />

        {/* Users */}
        <Route path="/users" element={<Users />} />

      </Route>

      {/* 3️⃣ Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
};

export default AppRoutes;