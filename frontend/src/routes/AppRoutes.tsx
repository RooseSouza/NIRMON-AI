import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import InputParameters from "../pages/InputParameter"; 
import Login from "../pages/Login";
import Users from "../pages/Users";

/**
 * AppRoutes defines the navigation structure for Nirmon AI.
 * The dynamic :projectId segment allows the InputParameters page to 
 * load the specific vessel data (like "MV ship") from localStorage.
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Initial Entry: Redirects to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 2. Authentication */}
      <Route path="/login" element={<Login />} />

      {/* 3. Project Dashboard (The Grid of Ship Cards) */}
      <Route path="/projects" element={<Projects />} />
      
      {/* 4. Project Creation Form */}
      <Route path="/projects/new" element={<NewProject />} />
      
      {/* 5. THE BRIDGE: 
          This route matches the navigate function in Projects.tsx.
          When clicking a card, the :projectId captures the unique ID.
      */}
      <Route 
        path="/projects/:projectId/parameters" 
        element={<InputParameters />} 
      />

      {/* 6. Admin and User Management */}
      <Route path="/users" element={<Users />} />
      
      {/* 7. Main Dashboard View */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 8. Fallback: Catch-all redirect for any broken links */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;