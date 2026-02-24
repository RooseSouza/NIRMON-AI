import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import DashboardLayout from "./components/layout/DashboardLayout";

const App = () => {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>

          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Dashboard Layout Wrap */}
          <Route element={<DashboardLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />

            {/* 👇 ADD THIS LINE */}
            <Route path="/projects/new" element={<NewProject />} />

          </Route>

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
};

export default App;