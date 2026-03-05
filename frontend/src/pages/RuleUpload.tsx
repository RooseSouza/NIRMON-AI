import React, { useState } from "react";
import { Upload, FileText, CheckCircle, Loader2, Save, AlertCircle, Sparkles, Download } from "lucide-react";

interface ExtractedRule {
  category: string;
  parameter_name: string;
  left_param: string;
  condition: string;
  right_param: string;
  description: string;
}

const RuleUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rules, setRules] = useState<ExtractedRule[]>([]);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setRules([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError("");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/extraction/upload-rules", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setRules(data.rules);
      } else {
        setError(data.error || "Extraction failed");
      }
    } catch (err) {
      setError("Network error. Check backend console.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ NEW: Function to Download JSON File
  const handleDownload = () => {
    if (rules.length === 0) return;

    const jsonString = JSON.stringify({ rules: rules }, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted_irclass_rules.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Rule Extraction Engine</h1>
          <p className="text-gray-500 mt-1">Upload IRClass PDF documents to automatically extract GA constraints.</p>
        </header>

        {/* UPLOAD AREA */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
              <Upload size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">
              {file ? file.name : "Click or Drag PDF Here"}
            </h3>
            <p className="text-sm text-gray-400 mt-2">Supports IRClass Rules (PDF)</p>
          </div>

          {file && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleUpload}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin" /> Processing with Parallel Threads...</>
                ) : (
                  <><Sparkles size={20} /> Extract Rules with AI</>
                )}
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
              <AlertCircle size={20} /> {error}
            </div>
          )}
        </div>

        {/* RESULTS TABLE */}
        {rules.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> 
                Extracted Constraints ({rules.length})
              </h3>
              
              <div className="flex gap-3">
                {/* ✅ NEW: Download Button */}
                <button 
                  onClick={handleDownload}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center gap-2 border border-gray-300"
                >
                  <Download size={16} /> Download JSON
                </button>

                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2 shadow-sm">
                  <Save size={16} /> Save to Database
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-4 w-1/6">Category</th>
                    <th className="p-4 w-1/4">Parameter</th>
                    <th className="p-4 w-1/4">Formula / Condition</th>
                    <th className="p-4 w-1/3">Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rules.map((rule, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-gray-700 text-sm">{rule.category}</td>
                      <td className="p-4 text-blue-600 font-medium text-sm">{rule.parameter_name}</td>
                      <td className="p-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono text-xs border border-gray-200">
                          {rule.left_param} {rule.condition} {rule.right_param}
                        </code>
                      </td>
                      <td className="p-4 text-xs text-gray-500">{rule.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RuleUpload;