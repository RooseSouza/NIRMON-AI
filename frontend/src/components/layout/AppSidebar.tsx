import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Icons (OLD ONES)
import { GridIcon, CalenderIcon } from "../icons";

// Context
import { useSidebar } from "../../context/SidebarContext";

// Logo
import logo from "../../assets/nirmon-logo.png";

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
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const generatePath = (name: string) =>
    `/${name.toLowerCase().replace(/\s+/g, "-")}`;

  // 🔥 ICON MAPPER
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
      {/* LOGO */}
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

      {/* MENU */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {modules.map((module) => {
              const path = generatePath(module.module_name);

              return (
                <li key={module.module_id}>
                  {/* Parent */}
                  <Link
                    to={path}
                    className={`menu-item group ${
                      isActive(path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "lg:justify-start"
                    }`}
                  >
                    {/* ICON */}
                    <span className="menu-item-icon-size">
                      {getIcon(module.module_name)}
                    </span>

                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">
                        {module.module_name}
                      </span>
                    )}
                  </Link>

                  {/* Children */}
                  {module.children &&
                    module.children.length > 0 &&
                    (isExpanded || isHovered || isMobileOpen) && (
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