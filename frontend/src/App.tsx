import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import ProjectDetails from "./pages/ProjectDetails"; // Added import
import InputParameter from "./pages/InputParameter"; // Added import

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

const App = () => {
  return (
    <AuthProvider> {/* Wrap with AuthProvider if you use authentication */}
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Public Route */}
            <Route path="/" element={<Login />} />

            {/* 2. Authenticated Dashboard Layout Wrap */}
            <Route element={<DashboardLayout />}>
              
              {/* Main Sidebar Links */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />

              {/* Project Management Flow */}
              <Route path="/projects/new" element={<NewProject />} />
              
              {/* ✅ STEP 1: View Project Information (When you click a card) */}
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              
              {/* ✅ STEP 2: Add Parameters (Inside Project Details) */}
              <Route path="/projects/:projectId/parameters" element={<InputParameter />} />

            </Route>

            {/* 3. Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;