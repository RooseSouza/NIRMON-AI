import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import InputParameter from "../pages/InputParameter";
import Login from "../pages/Login";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ✅ Public Route (NO sidebar) */}
      <Route path="/login" element={<Login />} />

      {/* ✅ Protected Routes */}
      <Route element={<ProtectedRoute />}>

        {/* 🔥 Wrap ALL protected pages with DashboardLayout */}
        <Route element={<DashboardLayout />}>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:id/input" element={<InputParameter />} />

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;