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

  return (
    <div
      onClick={() => navigate(`/projects/${id}/parameters`)}
      className="
        group
        bg-white
        border border-gray-200
        rounded-xl
        p-8
        shadow-sm
        hover:shadow-xl
        hover:border-blue-500
        hover:-translate-y-1
        transition-all duration-300
        cursor-pointer
        relative
        min-h-[180px]
      "
    >
      {/* Top Row: Code + Status */}
      <div className="flex justify-between items-start mb-6">
        <span className="
          px-3 py-1
          rounded
          bg-blue-50
          text-blue-600
          text-[10px]
          font-bold
          uppercase
          border border-blue-100
        ">
          {projectCode}
        </span>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${projectStatus === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className={`text-xs font-semibold uppercase ${projectStatus === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
            {projectStatus}
          </span>
        </div>
      </div>

      {/* Project Name */}
      <h3 className="
        text-2xl font-bold text-gray-900 mb-1
        group-hover:text-blue-600
        transition-colors
      ">
        {projectName}
      </h3>

      {/* Decorative Icon */}
      <Ship className="
        absolute right-4 bottom-4
        w-12 h-12
        text-gray-100
        group-hover:text-blue-50
        transition-colors
      " />
    </div>
  );
};

export default ProjectCard;