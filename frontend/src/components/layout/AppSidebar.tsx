import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Context
import { useSidebar } from "../../context/SidebarContext";

// Logos
import logo from "../../assets/nirmon-logo.png";
import logoSmall from "../../assets/nirmon-logo-small.png";

// Icons
import { GridIcon, CalenderIcon } from "../icons"; // Assuming these are your custom icons

interface Module {
  module_id: string;
  module_name: string;
  parent_module_id: string | null;
  children?: Module[];
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const storedModules = localStorage.getItem("modules");
    if (storedModules) {
      setModules(JSON.parse(storedModules));
    }
  }, []);

  const isActive = useCallback(
    (path: string) => {
      if (path === "/dashboard") return location.pathname === "/dashboard";
      if (path === "/projects") return location.pathname.startsWith("/projects");
      return false;
    },
    [location.pathname]
  );

  const generatePath = (name: string) =>
    `/${name.toLowerCase().replace(/\s+/g, "-")}`;

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "dashboard":
        return <GridIcon />;
      case "projects":
        return <CalenderIcon />;
      default:
        return null;
    }
  };

  const showFullContent = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed top-0 flex flex-col px-5 left-0 
      bg-white dark:bg-gray-900 dark:border-gray-800 
      text-gray-900 h-screen transition-all duration-300 
      ease-in-out z-50 border-r border-gray-200 
      ${
        showFullContent
          ? "w-[260px]"
          : "w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO SECTION */}
      <div
        className={`py-8 flex ${
          !showFullContent ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard">
          {showFullContent ? (
            // Full Logo
            <img
              src={logo}
              alt="Nirmon Logo"
              className="h-10 w-auto object-contain transition-all duration-300"
            />
          ) : (
            // Small Logo
            <img
              src={logoSmall}
              alt="Logo Small"
              className="h-8 w-8 object-contain transition-all duration-300"
            />
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {modules.map((module) => {
              const path = generatePath(module.module_name);

              return (
                <li key={module.module_id}>
                  {/* Parent Link */}
                  <Link
                    to={path}
                    className={`menu-item group ${
                      isActive(path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } ${
                      !showFullContent
                        ? "lg:justify-center"
                        : "lg:justify-start"
                    }`}
                  >
                    {/* ICON */}
                    <span className="menu-item-icon-size">
                      {getIcon(module.module_name)}
                    </span>

                    {/* TEXT */}
                    {showFullContent && (
                      <span className="menu-item-text">
                        {module.module_name}
                      </span>
                    )}
                  </Link>

                  {/* Children Links */}
                  {module.children &&
                    module.children.length > 0 &&
                    showFullContent && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {module.children.map((child) => {
                          const childPath = generatePath(child.module_name);

                          return (
                            <li key={child.module_id}>
                              <Link
                                to={childPath}
                                className={`menu-dropdown-item ${
                                  isActive(childPath)
                                    ? "menu-item-active"
                                    : ""
                                }`}
                              >
                                {child.module_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
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