import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar"; // Import your new sidebar
import Topbar from "./Topbar";
import { useSidebar } from "../../context/SidebarContext"; // Import context hook

const DashboardLayout = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Logic to determine how much space to leave for the sidebar
  // If expanded/hovered: 290px, Collapsed: 90px
  const mainContentMargin = 
    (isExpanded || isHovered || isMobileOpen) 
      ? "lg:ml-[290px]" 
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* 1. The New Fixed Sidebar */}
      <AppSidebar />

      {/* 2. The Main Content Area (Pushed right by margin) */}
      <div 
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Topbar stays at the top of the content area */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
          <Topbar />
        </div>

        {/* Page Content (Dashboard/Projects) */}
        <main className="p-6 mx-auto w-full max-w-screen-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;