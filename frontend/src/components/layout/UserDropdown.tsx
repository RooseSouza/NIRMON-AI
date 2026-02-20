import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Get user role from local storage (set during login)
  const userRole = localStorage.getItem("userRole");
  const isViewer = userRole === "viewer";
  const displayName = isViewer ? "Viewer" : "Musharof"; // Example name
  const displayRole = isViewer ? "Viewer" : "Admin";

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("userRole");
    navigate("/");
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400 focus:outline-none"
      >
        <span className="mr-3 overflow-hidden rounded-full h-10 w-10 border border-gray-200">
          {/* You can replace this with a dynamic image or initials */}
          <img src="https://ui-avatars.com/api/?name=Musharof&background=0D8ABC&color=fff" alt="User" />
        </span>

        <span className="hidden lg:block mr-1 font-medium text-sm">{displayName}</span>
        
        <svg
          className={`hidden lg:block stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 w-60 flex-col rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50"
      >
        <div className="px-3 py-2">
          <span className="block font-medium text-gray-900 text-sm dark:text-white">
            {displayName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {displayRole}
          </span>
        </div>

        <div className="h-px bg-gray-200 my-1 dark:bg-gray-800" />

        <ul className="flex flex-col gap-1">
          <li>
            <DropdownItem
              onClick={closeDropdown}
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </DropdownItem>
          </li>
          
          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}