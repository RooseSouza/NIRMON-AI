import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  return (
    // Main Container with the slight gradient background
    <div className="flex h-screen bg-gradient-to-br from-[#5a7d96] to-[#4a657e] p-4 gap-4 font-genos overflow-hidden">
      
      {/* Sidebar - Fixed width */}
      <Sidebar />
      
      {/* Right Side - Column */}
      <div className="flex flex-col flex-1 gap-4 overflow-hidden">
        <Topbar />
        
        {/* Main Content Area - Matching the dark blue-grey panel color */}
        <div className="flex-1 bg-[#344e63] rounded-3xl p-8 shadow-lg overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;