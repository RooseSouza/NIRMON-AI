import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import InputParameter from "../pages/InputParameter";
import Login from "../pages/Login";
import ProjectDetails from "../pages/ProjectDetails";
import HullGeometry from "../pages/HullGeometry"; // 

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ✅ Public Route */}
      <Route path="/login" element={<Login />} />

      {/* ✅ Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* 🔥 Dashboard Layout Wrapper */}
        <Route element={<DashboardLayout />}>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<NewProject />} />
          
          {/* ✅ THE FIX: 
              1. Changed :id to :projectId to match your component logic 
              2. Added the Hull Geometry route
          */}
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/input" element={<InputParameter />} />
          <Route path="/projects/:id/hull-geometry" element={<HullGeometry />} />

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;