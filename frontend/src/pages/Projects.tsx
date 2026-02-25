import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Ship } from "lucide-react";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch the projects from localStorage
    // This ensures newly created projects like "MV ship" show up immediately
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(savedProjects);
  }, []);

  return (
    <div className="w-full h-full flex flex-col px-8 py-8 bg-gray-50/50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide uppercase">Projects</h1>
          <p className="text-gray-500 text-sm mt-1 tracking-wide uppercase">
            Manage your ship design projects
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            onClick={() => navigate("/projects/new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#465FFF] text-white text-sm font-semibold shadow-md hover:bg-[#3548F5] transition-all"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1">
        {projects.length === 0 ? (
          <div className="w-full h-72 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-white">
            <p className="text-lg font-medium tracking-wide uppercase">No Projects Active</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                // NAVIGATION TRIGGER: This matches your AppRoutes bridge
                onClick={() => navigate(`/projects/${project.id}/parameters`)}
                className="group bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer relative min-h-[180px]"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase border border-blue-100">
                    {project.projectCode || "NO CODE"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-semibold text-green-600 uppercase">
                      {project.projectStatus || "Active"}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {project.projectName}
                </h3>
                <p className="text-gray-500 text-sm">{project.vesselType}</p>
                
                {/* Visual Ship Icon decoration */}
                <Ship className="absolute right-4 bottom-4 w-12 h-12 text-gray-100 group-hover:text-blue-50 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;