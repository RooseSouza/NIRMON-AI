import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import ProjectCard from "../components/project/ProjectCard";

interface Project {
  project_id: string;
  project_name: string;
  project_code: string;
  project_status: string;
  created_at: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Read URL params
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // Default filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Filter from URL on Mount (e.g. ?status=Active)
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/api/projects/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          // Sort Newest First
          const sortedProjects = (data.projects || []).sort((a: Project, b: Project) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          setProjects(sortedProjects);
        }

        const data = await response.json();

        // Sort newest first
        const sortedProjects = (data.projects || []).sort(
          (a: Project, b: Project) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setProjects(sortedProjects);
      } catch (err: any) {
        console.error("Project Fetch Error:", err);
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  // 🔎 Combined Filter Logic (Search + Status)
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.project_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || project.project_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen flex flex-col px-8 py-8 bg-gray-50">

      {/* HEADER */}
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
          
          {/* Status Filter Dropdown */}
          <div className="relative group">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer hover:bg-gray-50"
            >
              <option value="All">All</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
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

      {/* CONTENT */}
      <div className="flex-1">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

        ) : error ? (
          <div className="text-red-500 text-center mt-10">
            {error}
          </div>

        ) : filteredProjects.length === 0 ? (
          <div className="w-full h-72 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-white">
            <p className="text-lg font-medium uppercase">No Projects Found</p>
            {statusFilter !== "All" && (
              <button 
                onClick={() => setStatusFilter("All")}
                className="mt-4 text-blue-600 hover:underline text-sm font-medium"
              >
                Clear Filter
              </button>
            )}
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
                onClick={() =>
                  navigate(`/projects/${project.project_id}`)
                }
              />
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;