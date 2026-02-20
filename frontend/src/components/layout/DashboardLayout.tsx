import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar"; 
import Header from "./Header";
import { useSidebar } from "../../context/SidebarContext"; 

const DashboardLayout = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // FIX: Changed 290px to 260px to match AppSidebar.tsx width
  const mainContentMargin = 
    (isExpanded || isHovered || isMobileOpen) 
      ? "lg:ml-[260px]" 
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* 1. Sidebar (Fixed width is w-[260px]) */}
      <AppSidebar />

      {/* 2. Main Content Area */}
      {/* Now pushed exactly 260px to touch the sidebar */}
      <div 
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
          <Header />
        </div>

        {/* Page Content */}
        <main className="p-6 mx-auto w-full max-w-screen-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;