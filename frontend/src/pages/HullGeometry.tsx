import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Box, LayoutGrid, Ship, Database as DbIcon } from "lucide-react";

const HullGeometry: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 text-gray-500 hover:text-blue-600 font-bold text-xs transition-colors"
        >
          <ArrowLeft size={18} /> BACK TO PARAMETERS
        </button>

        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="text-blue-600" size={40} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hull Geometry & Offset Table</h1>
          <p className="text-gray-500 mb-2">Configure the 3D form and station data for your vessel.</p>
          <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-500 mb-10">
            Project ID: {id}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Action Card 1: Upload */}
            <div className="group p-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Box className="text-gray-400 group-hover:text-blue-500" size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Import Offset Table</h3>
              <p className="text-sm text-gray-500 mt-2">
                Upload existing hull data in .csv, .txt, or .dxf formats to generate the stations.
              </p>
            </div>

            {/* Action Card 2: AI Generation */}
            <div className="group p-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Ship className="text-gray-400 group-hover:text-blue-500" size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-800">AI Surface Generator</h3>
              <p className="text-sm text-gray-500 mt-2">
                Use NIRMON AI to generate a hull form based on your Principal Dimensions (LOA, Breadth, Draft).
              </p>
            </div>
          </div>

          {/* Bottom Status Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <DbIcon size={14} /> Database Linked
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div> System Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HullGeometry;