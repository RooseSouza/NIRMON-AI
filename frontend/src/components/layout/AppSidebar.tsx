import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

// Icons
import { GridIcon, CalenderIcon } from "../icons";

// Context
import { useSidebar } from "../../context/SidebarContext";

// Logo
import logo from "../../assets/nirmon-logo.png";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

// ✅ ONLY TWO MENU ITEMS
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <CalenderIcon />,
    name: "Projects",
    path: "/projects",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // 🔥 UPDATED ACTIVE LOGIC
  const isActive = useCallback(
    (path: string) => {
      // Dashboard exact match
      if (path === "/dashboard") {
        return location.pathname === "/dashboard";
      }

      // Projects & all sub routes
      if (path === "/projects") {
        return location.pathname.startsWith("/projects");
      }

      return false;
    },
    [location.pathname]
  );

  return (
    <aside
      className={`fixed top-0 flex flex-col px-5 left-0 
      bg-white dark:bg-gray-900 dark:border-gray-800 
      text-gray-900 h-screen transition-all duration-300 
      ease-in-out z-50 border-r border-gray-200 
      ${
        isExpanded || isMobileOpen
          ? "w-[260px]"
          : isHovered
          ? "w-[260px]"
          : "w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ================= LOGO ================= */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard">
          <img
            src={logo}
            alt="Nirmon Logo"
            className={`object-contain transition-all duration-300 ${
              isExpanded || isHovered || isMobileOpen
                ? "h-10 w-auto"
                : "h-8 w-8"
            }`}
          />
        </Link>
      </div>

      {/* ================= MENU ================= */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((nav) => {
              const active = isActive(nav.path);

              return (
                <li key={nav.name}>
                  <Link
                    to={nav.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${
                        active
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                      ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                      }`}
                  >
                    <span
                      className={`text-xl ${
                        active ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {nav.icon}
                    </span>

                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="font-medium">
                        {nav.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;