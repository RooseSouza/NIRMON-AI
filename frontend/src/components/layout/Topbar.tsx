import ProfileDropdown from "./ProfileDropdown";

const Topbar = () => {
  return (
    <div className="h-20 bg-[#344e63] rounded-3xl flex items-center justify-end px-8 shadow-lg gap-6">
      
      {/* Notification Icon */}
      <button className="text-white hover:text-gray-300 transition p-2 rounded-full hover:bg-white/10 relative">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {/* Notification Dot */}
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Divider */}
      <div className="h-8 w-[1px] bg-gray-500/50"></div>

      {/* Profile Section */}
      <ProfileDropdown />
    </div>
  );
};

export default Topbar;