import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      
      {/* Trigger Button (User Info) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 focus:outline-none group"
      >
        {/* User Icon Circle */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#344e63] shadow-md group-hover:scale-105 transition-transform duration-200">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Text Info */}
        <div className="text-left text-white">
          <div className="text-sm font-bold tracking-wide uppercase leading-tight group-hover:text-cyan-200 transition-colors">User Name</div>
          <div className="text-[10px] text-gray-300 font-medium tracking-wider uppercase">User Role</div>
        </div>

        {/* Dropdown Arrow with Rotation Animation */}
        <svg 
          className={`w-4 h-4 text-gray-300 transition-transform duration-300 ease-in-out ${open ? 'rotate-180 text-cyan-200' : 'rotate-0'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Animated Dropdown Menu */}
      <div 
        className={`absolute right-0 mt-4 w-48 origin-top-right transform transition-all duration-300 ease-out
          ${open ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}
        `}
      >
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-between bg-[#cc0000] hover:bg-[#b30000] text-white px-6 py-3 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 group"
        >
          <span className="font-semibold tracking-wide">LOGOUT</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;