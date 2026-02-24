import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col px-8 py-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">

        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            PROJECTS
          </h1>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            MANAGE YOUR SHIP DESIGN PROJECTS
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              className="
                pl-10 pr-4 py-2.5
                w-64
                rounded-lg
                border border-gray-300
                bg-white
                text-gray-700 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                transition-all
              "
            />
          </div>

          {/* New Project Button */}
          <button
            onClick={() => navigate("/projects/new")}
            className="
              inline-flex items-center gap-2
              px-5 py-2.5
              rounded-lg
              bg-gradient-to-r from-[#465FFF] to-[#5A6BFF]
              text-white text-sm font-semibold
              shadow-[0_4px_14px_rgba(90,107,255,0.35)]
              hover:shadow-[0_6px_20px_rgba(90,107,255,0.45)]
              hover:from-[#3548F5] hover:to-[#4B5CFF]
              transition-all duration-300
            "
          >
            <Plus size={18} />
            New Project
          </button>

        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1">

        <div className="
          w-full
          h-72
          border-2 border-dashed border-gray-300
          rounded-xl
          flex flex-col items-center justify-center
          text-gray-500
        ">

          <svg
            className="w-16 h-16 mb-4 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>

          <p className="text-lg font-medium tracking-wide">
            NO PROJECTS ACTIVE
          </p>

        </div>
      </div>

    </div>
  );
};

export default Projects;