import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ShieldCheck, ChevronRight, Anchor, Loader2, AlertCircle } from 'lucide-react';

const InputParameter: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track if we are editing an existing record
  const [existingGaInputId, setExistingGaInputId] = useState<string | null>(null);

  // ================= FORM STATE =================
  const [formData, setFormData] = useState({
    regulatory_framework: '',
    class_notation: '',
    ums_notation: '', 
    gross_tonnage: '',
    deadweight: '',
    endurance_days: '',
    voyage_duration_days: '',
    crew_count: '',
    officer_count: '',
    rating_count: '',
    passenger_count: '0',
  });

  // ================= FETCH DATA (PROJECT + EXISTING INPUTS) =================
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // 1. Fetch Project Details
        const projRes = await fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (projRes.ok) {
            const projData = await projRes.json();
            setProjectDetails(projData);
        }

        // 2. Fetch Existing GA Inputs (if user came back)
        const inputRes = await fetch(`http://127.0.0.1:5000/api/gainputs/project/${id}/latest`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (inputRes.ok) {
            const prevData = await inputRes.json();
            
            // Prefill form with existing data
            setExistingGaInputId(prevData.ga_input_id);
            setFormData({
                regulatory_framework: prevData.regulatory_framework || '',
                class_notation: prevData.class_notation || '',
                ums_notation: prevData.ums_notation || '',
                gross_tonnage: prevData.gross_tonnage || '',
                deadweight: prevData.deadweight || '',
                endurance_days: prevData.endurance_days || '',
                voyage_duration_days: prevData.voyage_duration_days || '',
                crew_count: prevData.crew_count || '',
                officer_count: prevData.officer_count || '',
                rating_count: prevData.rating_count || '',
                passenger_count: prevData.passenger_count || '0',
            });
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // ================= SUBMIT LOGIC (CREATE OR UPDATE) =================
  const handleSaveAndNext = async () => {
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    // Validation
    if (!projectDetails?.vessel?.vessel_id) {
        setError("Vessel ID missing.");
        setIsSaving(false); return;
    }

    const officers = parseInt(formData.officer_count) || 0;
    const ratings = parseInt(formData.rating_count) || 0;
    const totalCrew = parseInt(formData.crew_count) || 0;

    if (totalCrew !== officers + ratings) {
        setError(`Total Crew (${totalCrew}) must equal Officers (${officers}) + Ratings (${ratings}).`);
        setIsSaving(false); return;
    }

    if (!formData.regulatory_framework || !formData.endurance_days) {
        setError("Please fill in required fields.");
        setIsSaving(false); return;
    }

    // Payload
    const payload = {
        project_id: id,
        vessel_id: projectDetails.vessel.vessel_id, 
        regulatory_framework: formData.regulatory_framework,
        class_notation: formData.class_notation,
        ums_notation: formData.ums_notation === "Yes",
        gross_tonnage: parseFloat(formData.gross_tonnage) || null,
        deadweight: parseFloat(formData.deadweight) || null,
        crew_count: totalCrew,
        officer_count: officers,
        rating_count: ratings,
        passenger_count: parseInt(formData.passenger_count) || 0,
        endurance_days: parseFloat(formData.endurance_days),
        voyage_duration_days: parseFloat(formData.voyage_duration_days) || null,
    };

    try {
        let url = "http://127.0.0.1:5000/api/gainputs/";
        let method = "POST";

        // DECISION: UPDATE OR CREATE?
        if (existingGaInputId) {
            url = `http://127.0.0.1:5000/api/gainputs/${existingGaInputId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            // Use existing ID or new ID from response
            const targetId = existingGaInputId || result.ga_input_id;
            
            navigate(`/projects/${id}/hull-geometry`, { 
                state: { gaInputId: targetId } 
            });
        } else {
            setError(result.error || "Failed to save data.");
        }
    } catch (err) {
        console.error(err);
        setError("Network error occurred.");
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600 transition-colors">
            <ArrowLeft size={18} /> BACK TO DETAILS
          </button>
          <button onClick={handleSaveAndNext} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>NEXT <ChevronRight size={18} /></>}
          </button>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        <div className="space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-gray-800">GA Input Parameters</h1>
            <p className="text-sm text-gray-500">Project: <span className="font-semibold text-blue-600">{projectDetails?.project_name}</span></p>
          </header>

          {/* --- SAME FORM SECTIONS AS BEFORE --- */}
          {/* Section 1: Regulatory */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <ShieldCheck className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Regulatory & Classification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Regulatory Framework *</label>
                <input name="regulatory_framework" value={formData.regulatory_framework} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class Notation</label>
                <input name="class_notation" value={formData.class_notation} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UMS Notation</label>
                <select name="ums_notation" value={formData.ums_notation} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Tonnage */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Anchor className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Tonnage & Capacity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gross Tonnage</label><input type="number" name="gross_tonnage" value={formData.gross_tonnage} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deadweight</label><input type="number" name="deadweight" value={formData.deadweight} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Endurance (Days) *</label><input type="number" name="endurance_days" value={formData.endurance_days} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Voyage Duration</label><input type="number" name="voyage_duration_days" value={formData.voyage_duration_days} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
            </div>
          </section>

          {/* Section 3: Crew */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Users className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Ship Complement</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Officers *</label><input type="number" name="officer_count" value={formData.officer_count} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ratings *</label><input type="number" name="rating_count" value={formData.rating_count} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Crew *</label>
                 <input type="number" name="crew_count" value={formData.crew_count} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${parseInt(formData.crew_count) !== (parseInt(formData.officer_count)||0) + (parseInt(formData.rating_count)||0) ? 'border-red-300' : ''}`}/>
               </div>
               <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passengers</label><input type="number" name="passenger_count" value={formData.passenger_count} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl"/></div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InputParameter;