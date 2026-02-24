import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useSidebar } from "../../context/SidebarContext";

const DashboardLayout = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainMargin =
    isExpanded || isHovered || isMobileOpen
      ? "lg:ml-[260px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${mainMargin}`}
      >
        <Header />

        {/* IMPORTANT: No max-width here */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;