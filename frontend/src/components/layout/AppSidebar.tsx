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

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 
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
            className={`object-contain ${
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
            {navItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">
                      {nav.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;