import { NavLink } from "react-router-dom";
import logo from "../../assets/nirmon-logo.png"; // Ensure path is correct

const Sidebar = () => {
  return (
    <div className="w-60 bg-[#344e63] rounded-3xl p-5 flex flex-col shadow-lg">
      
      {/* Logo Container - White background, rounded */}
      <div className="bg-white rounded-xl px-4 py-3 mb-10 shadow-md">
        <img src={logo} alt="logo" className="h-12 object-contain w-full" />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-lg tracking-wide font-medium ${
              isActive 
                ? "bg-[#253a4d] text-white shadow-inner" 
                : "text-gray-300 hover:bg-[#3d5a73] hover:text-white"
            }`
          }
        >
          {/* Dashboard Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          DASHBOARD
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 text-lg tracking-wide font-medium ${
              isActive 
                ? "bg-[#253a4d] text-white shadow-inner" 
                : "text-gray-300 hover:bg-[#3d5a73] hover:text-white"
            }`
          }
        >
          {/* Projects Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PROJECTS
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;