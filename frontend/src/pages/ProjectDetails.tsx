import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // 1. Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // 1. Import CSS
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
  X,
  Save,
} from "lucide-react";

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasGaInput, setHasGaInput] = useState(false);

  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // New State for Date Validation Error
  const [dateError, setDateError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      try {
        // 1. Fetch Project Details (Existing)
        const projectRes = await fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (projectRes.ok) {
            setProject(await projectRes.json());
        }

        // 2. Check GA Inputs (Existing)
        const gaRes = await fetch(`http://127.0.0.1:5000/api/gainputs/project/${id}/latest`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setHasGaInput(gaRes.ok);

        // 3. FETCH DESIGN PREVIEW (New)
        if (gaRes.ok) {
            setPreviewLoading(true);
            const previewRes = await fetch(`http://127.0.0.1:5000/api/generation/preview/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (previewRes.ok) {
                const previewData = await previewRes.json();
                if (previewData.exists) {
                    setDesignPreview(previewData.svg);
                }
            }
            setPreviewLoading(false);
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
        // Ensure dates are strings YYYY-MM-DD
        start_date: project.start_date?.split("T")[0],
        target_delivery_date: project.target_delivery_date?.split("T")[0],
      });
    }
  }, [project]);

  // Helper to safely parse string to Date object for DatePicker
  const parseDate = (dateStr: string) => {
    return dateStr ? new Date(dateStr) : null;
  };

  // Helper to format Date object to YYYY-MM-DD for State/API
  const formatDateForApi = (date: Date | null) => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const handleUpdateProject = async () => {
    // 2. Final Validation Check before API Call
    if (editData.start_date && editData.target_delivery_date) {
      if (
        new Date(editData.target_delivery_date) <= new Date(editData.start_date)
      ) {
        setDateError("Target date must be after Start date");
        return;
      }
    }

    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setProject({ ...project, ...editData });
        setIsEditing(false);
        setDateError(""); // Clear errors
      } else {
        console.error("Failed to update");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isUnderReview = project?.project_status === "Under Review";

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  if (!project)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Project Not Found
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-blue-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> BACK TO PROJECTS
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Code
                </label>
                <p className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                  {project.project_code}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Status
                </label>
                <p
                  className={`font-semibold flex items-center gap-1 text-sm ${getStatusColor(project.project_status)}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(project.project_status)}`}
                  ></span>
                  {project.project_status}
                </p>
              </div>
            </div>
            <div className="border-t pt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">
                      Client
                    </label>
                    <p className="text-sm font-medium">
                      {project.client_name || "Internal"}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">
                      Start Date
                    </label>
                    <p className="text-sm font-medium">
                      {formatDateDisplay(project.start_date)}
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
                      {formatDateDisplay(project.target_delivery_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group w-full mt-10">
            {isUnderReview && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-max px-3 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                Project is Under Review. Editing disabled.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
            <button
              onClick={() =>
                !isUnderReview && navigate(`/projects/${id}/input`)
              }
              disabled={isUnderReview}
              className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isUnderReview ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5"}`}
            >
              {isUnderReview ? (
                <>
                  <Lock size={20} /> Locked for Review
                </>
              ) : hasGaInput ? (
                <>
                  <Edit size={20} /> Edit Parameters
                </>
              ) : (
                <>
                  <Plus size={20} /> Add Parameters
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: GA Model Viewer */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">General Arrangement Preview</h3>
             {designPreview && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-mono">DXF Generated</span>}
          </div>

          <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative min-h-[400px]">
            
            {previewLoading ? (
                <div className="flex flex-col items-center text-blue-600">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <span className="text-sm font-medium">Loading Blueprint...</span>
                </div>
            ) : designPreview ? (
                // ✅ Render the SVG safely
                <div 
                  className="w-full h-full p-4 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: designPreview }} 
                />
            ) : (
                // Placeholder if no design exists
                <div className="text-center text-gray-400">
                    <Ship className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                    <p className="font-semibold">No Design Generated Yet</p>
                    <p className="text-sm mt-1">Complete the parameters to generate a GA Plan.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Edit Project
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={editData.project_name}
                  onChange={(e) =>
                    setEditData({ ...editData, project_name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter project name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Project Code
                  </label>
                  <input
                    type="text"
                    value={editData.project_code}
                    onChange={(e) =>
                      setEditData({ ...editData, project_code: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter code"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editData.project_status}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        project_status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editData.client_name}
                    onChange={(e) =>
                      setEditData({ ...editData, client_name: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Shipyard
                  </label>
                  <input
                    type="text"
                    value={editData.shipyard_name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        shipyard_name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Shipyard Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Start Date
                  </label>
                  {/* 3. React Date Picker for Start Date */}
                  <DatePicker
                    selected={parseDate(editData.start_date)}
                    onChange={(date: Date | null) => {
                      setEditData({
                        ...editData,
                        start_date: formatDateForApi(date),
                      });
                      // Optional: Reset error if user fixes start date
                      setDateError("");
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                    placeholderText="Select Start Date"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Target Delivery
                  </label>
                  {/* 4. React Date Picker for Target Date with Validation */}
                  <DatePicker
                    selected={parseDate(editData.target_delivery_date)}
                    onChange={(date: Date | null) => {
                      setEditData({
                        ...editData,
                        target_delivery_date: formatDateForApi(date),
                      });
                      setDateError(""); // Clear error on change
                    }}
                    dateFormat="dd/MM/yyyy"
                    className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700 ${dateError ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholderText="Select Target Date"
                    minDate={parseDate(editData.start_date) || new Date()} // 5. Prevent selecting dates before Start Date
                  />
                </div>
              </div>

              {/* 6. Visual Error Message */}
              {dateError && (
                <p className="text-red-500 text-xs font-semibold">
                  {dateError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setDateError("");
                }}
                className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProject}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
