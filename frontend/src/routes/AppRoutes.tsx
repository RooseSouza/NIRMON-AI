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

import Decks  from "../pages/Decks";
import Compartments from "../pages/Compartments";
import Tanks from "../pages/Tanks";
import TankSegregation from "../pages/TankSegregation";
import Machinery from "../pages/Machinery";
import AdjacencyRules from "../pages/AdjacencyRules";
import Bulkheads from "../pages/Bulkheads";
import CargoHolds from "../pages/CargoHolds";
import EngineRoom from "../pages/EngineRoom";
import AccessOpenings from "../pages/AccessOpenings";
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
          <Route path="/projects/:id/ga_input_decks" element={<Decks />} />
          <Route path="/projects/:id/compartments" element={<Compartments />} />
          <Route path="/projects/:id/tanks" element={<Tanks />} />
          <Route path="/projects/:id/tank-segregation" element={<TankSegregation />} />
          <Route path="/projects/:id/machinery" element={<Machinery />} />
          <Route path="/projects/:id/adjacency-rules" element={<AdjacencyRules />} />
          <Route path="/projects/:id/bulkheads" element={<Bulkheads />} />
          <Route path="/projects/:id/cargo-holds" element={<CargoHolds />} />
          <Route path="/projects/:id/engine-room" element={<EngineRoom />} />
          <Route path="/projects/:id/access-openings" element={<AccessOpenings />} />
         

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