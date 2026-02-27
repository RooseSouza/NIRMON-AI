import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ship,
  Calendar,
  User,
  Anchor,
  Edit,
  Plus,
  Loader2,
  Lock,
} from "lucide-react";

const ProjectDetails: React.FC = () => {
  const { id } = useParams(); // Catches the UUID from the URL
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // New State: Check if parameters already exist
  const [hasGaInput, setHasGaInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // 1. Fetch Project Details
        const projectRes = await fetch(
          `http://127.0.0.1:5000/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (projectRes.ok) {
          const data = await projectRes.json();
          setProject(data);
        } else {
          console.error("Project not found");
        }

        // 2. Check if GA Inputs exist (to toggle Edit/Add button)
        const gaRes = await fetch(
          `http://127.0.0.1:5000/api/gainputs/project/${id}/latest`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (gaRes.ok) {
          setHasGaInput(true); // Data exists -> Edit Mode
        } else {
          setHasGaInput(false); // 404 -> Add Mode
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
  if (project) {
    setEditData({
      project_name: project.project_name,
      project_code: project.project_code,
      client_name: project.client_name,
      shipyard_name: project.shipyard_name,
      project_status: project.project_status,
      start_date: project.start_date?.split("T")[0],
      target_delivery_date: project.target_delivery_date?.split("T")[0],
    });
  }
}, [project]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );

  if (!project)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Project Not Found
      </div>
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600";
      case "Draft":
        return "text-gray-500";
      case "Under Review":
        return "text-yellow-600";
      case "Approved":
        return "text-blue-600";
      case "Completed":
        return "text-purple-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Draft":
        return "bg-gray-400";
      case "Under Review":
        return "bg-yellow-500";
      case "Approved":
        return "bg-blue-500";
      case "Completed":
        return "bg-purple-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

const handleUpdateProject = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      }
    );

    if (response.ok) {
      setProject({ ...project, ...editData });
      setIsEditing(false);
    } else {
      console.error("Failed to update");
    }
  } catch (err) {
    console.error(err);
  }
};

  // Logic to lock the project
  const isUnderReview = project.project_status === "Under Review";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "---";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Navigation Header */}
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-blue-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> BACK TO PROJECTS
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Project Info Card */}
        <div className="md:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Edit size={16} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Ship className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Project Information
            </h2>
          </div>

          <div className="space-y-6">
            {/* Row 1: Project Name + Vessel Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Project Name
                </label>
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {project.project_name}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Vessel Type
                </label>
                <p className="text-sm font-semibold text-gray-800">
                  {project.vessel?.vessel_type?.type_name || "Not Defined"}
                </p>
              </div>
            </div>

            {/* Row 2: Code + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Code
                </label>
                <p className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block text-sm">
                  {project.project_code}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Status
                </label>
                <p
                  className={`font-semibold flex items-center gap-1 text-sm ${getStatusColor(
                    project.project_status,
                  )}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(
                      project.project_status,
                    )}`}
                  ></span>
                  {project.project_status}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-6">
              {/* Row 3: Client + Shipyard */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">
                      Client
                    </label>
                    <p className="text-sm font-medium">
                      {project.client_name || "Internal Project"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Anchor size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">
                      Shipyard
                    </label>
                    <p className="text-sm font-medium">
                      {project.shipyard_name || "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 4: Start Date + Target Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">
                      Start Date
                    </label>
                    <p className="text-sm font-medium">
                      {formatDate(project.start_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">
                      Target Delivery
                    </label>
                    <p className="text-sm font-medium">
                      {formatDate(project.target_delivery_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Container */}
          <div className="relative group w-full mt-10">
            {/* Floating Message (Tooltip) */}
            {isUnderReview && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-max px-3 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                Project is Under Review. Editing disabled.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
              </div>
            )}

            {/* Main Button */}
            <button
              onClick={() =>
                !isUnderReview && navigate(`/projects/${id}/input`)
              }
              disabled={isUnderReview}
              className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 
                ${
                  isUnderReview
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5"
                }`}
            >
              {isUnderReview ? (
                <>
                  <Lock size={20} />
                  Locked for Review
                </>
              ) : hasGaInput ? (
                <>
                  <Edit size={20} />
                  Edit Parameters
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Parameters
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Empty Box */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Ship className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="font-semibold">GA Model Viewer Placeholder</p>
          </div>
        </div>
      </div>
      {isEditing && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    
    <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl border border-gray-100 relative">
      
      <h2 className="text-xl font-bold mb-6">Edit Project</h2>

      <div className="space-y-4">

        <input
          type="text"
          value={editData.project_name}
          onChange={(e) =>
            setEditData({ ...editData, project_name: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="Project Name"
        />

        <input
          type="text"
          value={editData.project_code}
          onChange={(e) =>
            setEditData({ ...editData, project_code: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="Project Code"
        />

        <input
          type="text"
          value={editData.client_name}
          onChange={(e) =>
            setEditData({ ...editData, client_name: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="Client Name"
        />

        <input
          type="text"
          value={editData.shipyard_name}
          onChange={(e) =>
            setEditData({ ...editData, shipyard_name: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="Shipyard Name"
        />

        <input
          type="date"
          value={editData.start_date}
          onChange={(e) =>
            setEditData({ ...editData, start_date: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="date"
          value={editData.target_delivery_date}
          onChange={(e) =>
            setEditData({ ...editData, target_delivery_date: e.target.value })
          }
          className="w-full border p-3 rounded-lg"
        />

      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdateProject}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ProjectDetails;
