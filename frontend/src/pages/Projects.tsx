import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import ProjectCard from "../components/project/ProjectCard";

// Interface matching your API response
interface Project {
  project_id: string;
  project_name: string;
  project_code: string;
  project_status: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:5000/api/projects/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects); // Assuming API returns { projects: [...] }
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔎 Filter logic
  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.project_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex flex-col px-8 py-8 bg-gray-50">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
            Manage your ship design projects
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* New Project Button */}
          <button
            onClick={() => navigate("/projects/new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#465FFF] to-[#5A6BFF] text-white text-sm font-semibold shadow-md hover:from-[#3548F5] hover:to-[#4B5CFF] hover:shadow-lg transition-all duration-300"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="w-full h-72 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-white">
            <p className="text-lg font-medium uppercase">No Projects Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.project_id}
                id={project.project_id}
                projectCode={project.project_code}
                projectName={project.project_name}
                projectStatus={project.project_status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;