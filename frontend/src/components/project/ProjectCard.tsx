import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  projectCode: string;
  projectName: string;
  projectStatus: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  projectCode,
  projectName,
  projectStatus
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("👉 Project Card Clicked!");
    console.log("   ID:", id);
    console.log("   Navigating to:", `/projects/${id}/input`);
    navigate(`/projects/${id}/input`);
  };

  // Helper for colors (kept same)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return { dot: "bg-green-500", text: "text-green-600" };
      case "Under Review": return { dot: "bg-yellow-500", text: "text-yellow-600" };
      case "Draft": return { dot: "bg-gray-400", text: "text-gray-500" };
      case "Completed": return { dot: "bg-blue-500", text: "text-blue-600" };
      case "Cancelled": return { dot: "bg-red-500", text: "text-red-600" };
      default: return { dot: "bg-gray-400", text: "text-gray-500" };
    }
  };

  const statusColor = getStatusColor(projectStatus);

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative min-h-[180px]"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase border border-blue-100">
          {projectCode}
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor.dot}`}></span>
          <span className={`text-xs font-semibold uppercase ${statusColor.text}`}>
            {projectStatus}
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {projectName}
      </h3>
      <Ship className="absolute right-4 bottom-4 w-12 h-12 text-gray-100 group-hover:text-blue-50 transition-colors" />
    </div>
  );
};

export default ProjectCard;