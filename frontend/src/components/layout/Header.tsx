import React from "react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { useSidebar } from "../../context/SidebarContext";
import { Menu, Bell } from "lucide-react";
import logo from "../../assets/nirmon-logo.png"; // Only used for Mobile view now

const Header: React.FC = () => {
  const { toggleMobileSidebar, toggleSidebar } = useSidebar();

  return (
    <header className="flex w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 transition-all duration-300">
      
      <div className="flex items-center justify-between grow px-6 h-16">
        
        {/* LEFT SIDE: Menu Toggle Only */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Toggle */}
          <button
            className="block lg:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={toggleMobileSidebar}
          >
            <Menu size={24} />
          </button>

          {/* Desktop Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          >
            <Menu size={24} />
          </button>

          {/* Mobile Logo (Visible only on mobile) */}
          <Link to="/dashboard" className="lg:hidden">
             <img src={logo} alt="Logo" className="h-8 w-auto" />
          </Link>

        </div>

        {/* RIGHT SIDE: Actions */}
        <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
              <span className="sr-only">View notifications</span>
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* User Profile */}
            <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;