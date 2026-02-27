import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, Activity, FileText, CheckCircle, Clock } from "lucide-react";
import { fetchWithAuth } from "../utils/api"; // Import utility

interface Project {
  project_id: string;
  project_status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch Logic using fetchWithAuth
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 👇 Uses utility. Handles auto-logout on 401.
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/projects/");

        // If session expired, response is null -> Stop execution
        if (!response) return; 

        if (response.ok) {
          const data = await response.json();
          const projects: Project[] = data.projects || [];

          setStats({
            active: projects.filter(p => p.project_status === "Active").length,
            pending: projects.filter(p => p.project_status === "Under Review").length,
            completed: projects.filter(p => p.project_status === "Completed").length,
            total: projects.length
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const goToProjects = (statusFilter: string) => {
    navigate(`/projects?status=${statusFilter}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-8 py-8 bg-gray-50">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
            Overview & Key Metrics
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Active Projects Card */}
        <div 
          onClick={() => goToProjects("Active")}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
        >
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">Active Projects</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? "-" : stats.active}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Ship size={24} />
          </div>
        </div>

        {/* Pending Review Card */}
        <div 
          onClick={() => goToProjects("Under Review")}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all hover:border-yellow-300 cursor-pointer group"
        >
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-yellow-600 transition-colors">Pending Review</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? "-" : stats.pending}
            </h3>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600 group-hover:bg-yellow-100 transition-colors">
            <Clock size={24} />
          </div>
        </div>

        {/* Completed Card */}
        <div 
          onClick={() => goToProjects("Completed")}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all hover:border-green-300 cursor-pointer group"
        >
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-green-600 transition-colors">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? "-" : stats.completed}
            </h3>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Total Projects Card */}
        <div 
          onClick={() => goToProjects("All")}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all hover:border-purple-300 cursor-pointer group"
        >
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-purple-600 transition-colors">Total Projects</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? "-" : stats.total}
            </h3>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Rest of Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Project Analytics</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">Last 30 Days</span>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <Activity size={48} className="mb-2 opacity-50" />
            <p className="text-sm font-medium uppercase tracking-wide">Chart Data Coming Soon</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              {/* Log Details */}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;