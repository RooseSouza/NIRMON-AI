import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Ship, Calendar, User, Anchor } from "lucide-react";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams(); // Catches the UUID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LOGIC: Fetch the specific project from your Neon DB via Flask API
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:5000/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProject(data.project); // Assuming backend returns { project: {...} }
        } else {
          console.error("Project not found in Database");
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectData();
  }, [projectId]);

  if (loading) return <div className="p-8 text-center font-bold">Loading Ship Data...</div>;
  if (!project) return <div className="p-8 text-center text-red-500 font-bold">Project Not Found</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Navigation Header */}
      <button 
        onClick={() => navigate("/projects")} 
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-blue-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> BACK TO PROJECTS
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Project Info Card (Logic to show DB info) */}
        <div className="md:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Ship className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Project Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Name</label>
              <p className="text-lg font-bold text-gray-900">{project.project_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code</label>
                <p className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                  {project.project_code}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-400" />
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Client</label>
                  <p className="text-sm font-medium">{project.client_name || "Internal Project"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Anchor size={16} className="text-gray-400" />
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Shipyard</label>
                  <p className="text-sm font-medium">{project.shipyard_name || "Not Assigned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Start Date</label>
                  <p className="text-sm font-medium">{project.start_date || "---"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Parameter Button */}
          <button
            onClick={() => navigate(`/projects/${projectId}/parameters`)}
            className="w-full mt-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
          >
            Add Parameter
          </button>
        </div>

        {/* Right Side: Detailed Vessel Specs (Placeholder for Step 1 Info) */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-tight">Vessel Technical Data</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">LOA</span>
                <p className="text-xl font-black text-gray-800">{project.loa} m</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Beam</span>
                <p className="text-xl font-black text-gray-800">{project.beam} m</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Draft</span>
                <p className="text-xl font-black text-gray-800">{project.draft} m</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;