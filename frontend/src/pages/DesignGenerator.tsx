import React, { useState } from "react";
import { PenTool, Loader2, Download, Zap } from "lucide-react";

const DesignGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");
  const [rawData, setRawData] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/generation/generate-rsv", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setSvgContent(data.svg);
        setRawData(data.raw_data);
      } else {
        alert("Generation failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Generative Design Engine</h1>
            <p className="text-gray-500 mt-1">AI-Powered RSV General Arrangement Generator</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin"/> : <Zap size={20} />}
            Generate Design
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PREVIEW */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Live GA Preview</h3>
            
            <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden p-4">
              {svgContent ? (
                // Render the SVG string from backend safely
                <div 
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svgContent }} 
                />
              ) : (
                <div className="text-center text-gray-400">
                  <PenTool size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Click Generate to create a blueprint</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: DATA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Geometry Data</h3>
            <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-xl h-[400px] overflow-auto">
              {rawData ? (
                <pre>{JSON.stringify(rawData, null, 2)}</pre>
              ) : (
                <p className="opacity-50">// Waiting for AI output...</p>
              )}
            </div>
            {rawData && (
                <button className="w-full mt-4 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2">
                    <Download size={18} /> Download DXF
                </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DesignGenerator;