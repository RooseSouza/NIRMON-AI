import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Users, ShieldCheck, ChevronRight, Anchor, Loader2 } from 'lucide-react';

const InputParameter: React.FC = () => {
  // Use 'projectId' to match the route we defined in AppRoutes
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // State for technical entities
  const [formData, setFormData] = useState({
    regulatory_framework: '',
    class_notation: '',
    ums_notation: '',
    ship_type: '',
    gross_tonnage: '',
    deadweight: '',
    endurance_days: '',
    voyage_duration_days: '',
    crew_count: '',
    officer_count: '',
    rating_count: '',
    passenger_count: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving to Database for Project:", projectId, formData);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      alert("Technical parameters saved successfully!");
    }, 1000);
  };

  const handleNext = () => {
    // Navigate to the Hull Geometry page using the current project ID
    navigate(`/projects/${projectId}/hull-geometry`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} /> BACK TO DETAILS
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              SAVE
            </button>
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              NEXT <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-gray-800">Vessel Technical Parameters</h1>
            <p className="text-sm text-gray-500">Project Reference: <span className="font-mono text-blue-600">{projectId}</span></p>
          </header>

          {/* SECTION 1: Regulatory & Classification */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <ShieldCheck className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Regulatory & Classification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Regulatory Framework</label>
                <input name="regulatory_framework" value={formData.regulatory_framework} placeholder="e.g. SOLAS / MARPOL" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class Notation</label>
                <input name="class_notation" value={formData.class_notation} placeholder="e.g. +A1 Towing Vessel" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UMS Notation</label>
                <select name="ums_notation" value={formData.ums_notation} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 2: Tonnage & Capacity */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Anchor className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Tonnage & Capacity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Gross Tonnage (GT)', name: 'gross_tonnage' },
                { label: 'Deadweight (DWT)', name: 'deadweight' },
                { label: 'Endurance (Days)', name: 'endurance_days' },
                { label: 'Voyage Duration', name: 'voyage_duration_days' },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{field.label}</label>
                  <input 
                    name={field.name} 
                    type="number" 
                    value={(formData as any)[field.name]}
                    onChange={handleChange} 
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: Ship Complement */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Users className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Ship Complement</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Officers', name: 'officer_count' },
                { label: 'Ratings', name: 'rating_count' },
                { label: 'Total Crew', name: 'crew_count' },
                { label: 'Passengers', name: 'passenger_count' },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{field.label}</label>
                  <input 
                    name={field.name} 
                    type="number" 
                    value={(formData as any)[field.name]}
                    onChange={handleChange} 
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InputParameter;