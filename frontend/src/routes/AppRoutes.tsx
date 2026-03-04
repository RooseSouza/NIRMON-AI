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
import HullGeometry from "../pages/HullGeometry"; 
import RuleUpload from "../pages/RuleUpload"; // <--- IMPORT THIS
import DesignGenerator from "../pages/DesignGenerator";

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
          
          {/* Project Specifics */}
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/input" element={<InputParameter />} />
          <Route path="/projects/:id/hull-geometry" element={<HullGeometry />} />

          {/* ✅ NEW RULE EXTRACTION ROUTE */}
          <Route path="/rule-extraction" element={<RuleUpload />} />
          <Route path="/ai-generation" element={<DesignGenerator />} />

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;