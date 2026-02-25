import { useState } from "react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { useSidebar } from "../../context/SidebarContext";

const Header: React.FC = () => {
  const { toggleMobileSidebar } = useSidebar();

  return (
    // Changed: Removed sticky/top-0/z-40 because the parent wrapper in DashboardLayout already handles it.
    // Kept w-full to fill the width of the pushed content area.
    <header className="flex w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      
      {/* Container: Removed lg:px-6 to let it touch edges if desired, or keep px-4/6 for internal spacing */}
      <div className="flex items-center justify-between grow px-4 lg:px-6 h-16">
        
        {/* Left Side: Mobile Toggle & Search */}
        <div className="flex items-center w-full gap-2 lg:w-auto lg:justify-start">
          
          {/* Mobile Toggle */}
          <button
            className="block w-10 h-10 text-gray-500 lg:hidden dark:text-gray-400 focus:outline-none"
            onClick={toggleMobileSidebar}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Logo */}
          <Link to="/dashboard" className="lg:hidden">
             <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 lg:justify-end">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none">
              <span className="sr-only">View notifications</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            </button>

            {/* Divider */}
            <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* User Profile */}
            <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;