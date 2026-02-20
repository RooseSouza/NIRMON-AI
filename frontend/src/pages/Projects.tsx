import React from 'react';

const Projects = () => {
  return (
    <div className="h-full flex flex-col font-genos">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-500/30 pb-4">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-wide">
            PROJECTS
          </h1>
          <p className="text-gray-300 text-sm mt-1 tracking-wider">
            MANAGE YOUR SHIP DESIGN PROJECTS
          </p>
        </div>

        {/* Actions Group (Search + Button) */}
        <div className="flex items-center gap-4">
          
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              className="bg-[#253a4d] text-white pl-11 pr-4 py-2.5 rounded-full border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none w-64 placeholder-gray-500 text-sm tracking-wide transition-all shadow-inner"
            />
          </div>

          {/* + NEW PROJECT Button */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-bold tracking-wide shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
            NEW PROJECT
          </button>
        </div>
      </div>

      {/* Main Content Area (Placeholder) */}
      <div className="flex-1">
        <div className="w-full h-64 border-2 border-dashed border-gray-500/30 rounded-2xl flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg tracking-wide">NO PROJECTS ACTIVE</p>
        </div>
      </div>

    </div>
  );
};

export default Projects;