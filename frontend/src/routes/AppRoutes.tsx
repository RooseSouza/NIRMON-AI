import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import InputParameter from "../pages/InputParameter";
import Login from "../pages/Login";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1️⃣ Public Route */}
      <Route path="/login" element={<Login />} />

      {/* 2️⃣ Protected Routes - Everything inside here requires Login */}
      <Route element={<ProtectedRoute />}>
        
        {/* Default redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/users" element={<Users />} />

        {/* Project Creation Flow */}
        <Route path="/projects/new" element={<NewProject />} />

        {/* ✅ STEP 1: Project Details (The page that shows Ship Info) */}
        <Route path="/projects/:projectId" element={<ProjectDetails />} />

        {/* ✅ STEP 2: Input Parameters (The page for Decks/Dimensions) */}
        <Route 
          path="/projects/:projectId/parameters" 
          element={<InputParameter />} 
        />

      </Route>

      {/* 3️⃣ Fallback - If route doesn't exist, go to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;