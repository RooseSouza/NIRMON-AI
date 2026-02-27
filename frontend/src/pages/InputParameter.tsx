import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ShieldCheck, ChevronRight, Anchor, Loader2, AlertCircle } from 'lucide-react';

const InputParameter: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingGaInputId, setExistingGaInputId] = useState<string | null>(null);

  // --- STYLES ---
  // Standard "Normal" Input Style (White bg, gray border)
  const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide";

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const projRes = await fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (projRes.ok) {
            const projData = await projRes.json();
            setProjectDetails(projData);
        }

        const inputRes = await fetch(`http://127.0.0.1:5000/api/gainputs/project/${id}/latest`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (inputRes.ok) {
            const prevData = await inputRes.json();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSaveAndNext = async () => {
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!projectDetails?.vessel?.vessel_id) { setError("Vessel ID missing."); setIsSaving(false); return; }

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
        if (existingGaInputId) {
            url = `http://127.0.0.1:5000/api/gainputs/${existingGaInputId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            const targetId = existingGaInputId || result.ga_input_id;
            navigate(`/projects/${id}/hull-geometry`, { state: { gaInputId: targetId } });
        } else {
            setError(result.error || "Failed to save data.");
        }
    } catch (err) {
        setError("Network error occurred.");
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> BACK TO DETAILS
          </button>
          <button onClick={handleSaveAndNext} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
          </button>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        <div className="space-y-6">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">GA Input Parameters</h1>
            <p className="text-sm text-gray-500 mt-1">Project: <span className="font-medium text-blue-600">{projectDetails?.project_name}</span> ({projectDetails?.project_code})</p>
          </header>

          {/* Section 1 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <ShieldCheck className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Regulatory & Classification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className={labelClass}>Regulatory Framework *</label><input name="regulatory_framework" value={formData.regulatory_framework} onChange={handleChange} className={inputClass} placeholder="e.g. SOLAS, MARPOL" /></div>
              <div><label className={labelClass}>Class Notation</label><input name="class_notation" value={formData.class_notation} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>UMS Notation</label>
                <select name="ums_notation" value={formData.ums_notation} onChange={handleChange} className={inputClass}>
                  <option value="">Select Option</option><option value="Yes">Yes</option><option value="No">No</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Anchor className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Tonnage & Capacity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div><label className={labelClass}>Gross Tonnage</label><input type="number" name="gross_tonnage" value={formData.gross_tonnage} onChange={handleChange} className={inputClass}/></div>
               <div><label className={labelClass}>Deadweight</label><input type="number" name="deadweight" value={formData.deadweight} onChange={handleChange} className={inputClass}/></div>
               <div><label className={labelClass}>Endurance (Days) *</label><input type="number" name="endurance_days" value={formData.endurance_days} onChange={handleChange} className={inputClass}/></div>
               <div><label className={labelClass}>Voyage Duration</label><input type="number" name="voyage_duration_days" value={formData.voyage_duration_days} onChange={handleChange} className={inputClass}/></div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Users className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Ship Complement</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div><label className={labelClass}>Officers *</label><input type="number" name="officer_count" value={formData.officer_count} onChange={handleChange} className={inputClass}/></div>
               <div><label className={labelClass}>Ratings *</label><input type="number" name="rating_count" value={formData.rating_count} onChange={handleChange} className={inputClass}/></div>
               <div>
                 <label className={labelClass}>Total Crew *</label>
                 <input type="number" name="crew_count" value={formData.crew_count} onChange={handleChange} 
                    className={`${inputClass} ${parseInt(formData.crew_count) !== (parseInt(formData.officer_count)||0) + (parseInt(formData.rating_count)||0) ? 'border-red-500 bg-red-50' : ''}`}
                 />
               </div>
               <div><label className={labelClass}>Passengers</label><input type="number" name="passenger_count" value={formData.passenger_count} onChange={handleChange} className={inputClass}/></div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InputParameter;