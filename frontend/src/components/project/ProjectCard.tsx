import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  projectCode: string;
  projectName: string;
  projectStatus: string;
  vesselType?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, projectCode, projectName, projectStatus, vesselType }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("Card clicked! Target ID:", id); // Check this in F12 console!
    if (id) {
      // This sends the user to the URL that AppRoutes is watching for
      navigate(`/projects/${id}/parameters`);
    } else {
      alert("Logic Error: Project ID is missing from this card!");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative min-h-[180px]"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase border border-blue-100">
          {projectCode || "NO CODE"}
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${projectStatus === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span className="text-xs font-semibold uppercase text-gray-600">{projectStatus || 'Active'}</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {projectName}
      </h3>
      <p className="text-gray-500 text-sm italic">{vesselType}</p>
      <Ship className="absolute right-4 bottom-4 w-12 h-12 text-gray-100 group-hover:text-blue-50 transition-colors" />
    </div>
  );
};

export default ProjectCard;