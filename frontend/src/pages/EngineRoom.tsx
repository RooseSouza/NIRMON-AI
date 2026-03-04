import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle, ChevronRight, Settings } from 'lucide-react';

const EngineRoom: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage engine room data (typically single entry per project)
  const [engineRoom, setEngineRoom] = useState({
    fwd_bulkhead_frame: '',
    aft_bulkhead_frame: '',
    fwd_bulkhead_x: '',
    aft_bulkhead_x: '',
    inner_bottom_height: '',
    deck_lower_id: '',
    deck_upper_id: '',
    main_engine_footprint_length: '',
    main_engine_footprint_width: '',
    main_engine_height: '',
    main_engine_weight_tonnes: '',
    shaft_centerline_z: '',
    shaft_inclination_angle: '',
    casing_length: '',
    casing_width: '',
    casing_start_deck_id: '',
    casing_end_deck_id: '',
    steering_gear_area_m2: '',
    steering_gear_frame: '',
    notes: ''
  });

  // --- STYLES ---
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide";
  const sectionClass = "bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6";
  const subSectionTitleClass = "text-sm font-bold text-gray-700 mb-4 bg-gray-100 p-2 rounded flex items-center gap-2";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEngineRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAndNavigate = async () => {
    if (!gaInputId) {
        setError("Missing GA Input Reference. Please go back and save parameters.");
        return;
    }
    
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    // Prepare payload (convert strings to numbers)
    const payload = {
        ...engineRoom,
        fwd_bulkhead_frame: parseInt(engineRoom.fwd_bulkhead_frame) || 0,
        aft_bulkhead_frame: parseInt(engineRoom.aft_bulkhead_frame) || 0,
        fwd_bulkhead_x: parseFloat(engineRoom.fwd_bulkhead_x) || 0,
        aft_bulkhead_x: parseFloat(engineRoom.aft_bulkhead_x) || 0,
        inner_bottom_height: parseFloat(engineRoom.inner_bottom_height) || 0,
        main_engine_footprint_length: parseFloat(engineRoom.main_engine_footprint_length) || 0,
        main_engine_footprint_width: parseFloat(engineRoom.main_engine_footprint_width) || 0,
        main_engine_height: parseFloat(engineRoom.main_engine_height) || 0,
        main_engine_weight_tonnes: parseFloat(engineRoom.main_engine_weight_tonnes) || 0,
        shaft_centerline_z: parseFloat(engineRoom.shaft_centerline_z) || 0,
        shaft_inclination_angle: parseFloat(engineRoom.shaft_inclination_angle) || 0,
        casing_length: parseFloat(engineRoom.casing_length) || 0,
        casing_width: parseFloat(engineRoom.casing_width) || 0,
        steering_gear_area_m2: parseFloat(engineRoom.steering_gear_area_m2) || 0,
        steering_gear_frame: parseInt(engineRoom.steering_gear_frame) || 0,
    };

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/engine-room`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // Navigate to next step
            navigate(`/projects/${id}/next-step`, { state: { gaInputId } });
        } else {
            const result = await response.json();
            setError(result.error || "Failed to save engine room data.");
        }
    } catch (err) {
        setError("Network error occurred.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> BACK
          </button>
          <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
          </button>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Engine Room</h1>
          <p className="text-sm text-gray-500 mt-1">Specify engine room boundaries and machinery for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Engine Room Form */}
        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center"><Settings size={18}/></div>
              <h3 className="text-lg font-bold text-gray-800">Engine Room Constraints</h3>
          </div>

          {/* Boundaries & Decks */}
          <div className={subSectionTitleClass}>Compartment Boundaries</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Fwd Bulkhead Frame</label><input type="number" name="fwd_bulkhead_frame" value={engineRoom.fwd_bulkhead_frame} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Aft Bulkhead Frame</label><input type="number" name="aft_bulkhead_frame" value={engineRoom.aft_bulkhead_frame} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Fwd Bulkhead X (m)</label><input type="number" name="fwd_bulkhead_x" value={engineRoom.fwd_bulkhead_x} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Aft Bulkhead X (m)</label><input type="number" name="aft_bulkhead_x" value={engineRoom.aft_bulkhead_x} onChange={handleInputChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div><label className={labelClass}>Inner Bottom Ht (m)</label><input type="number" name="inner_bottom_height" value={engineRoom.inner_bottom_height} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Lower Deck ID</label><input name="deck_lower_id" value={engineRoom.deck_lower_id} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Upper Deck ID</label><input name="deck_upper_id" value={engineRoom.deck_upper_id} onChange={handleInputChange} className={inputClass} /></div>
          </div>

          {/* Main Engine & Shaft */}
          <div className={subSectionTitleClass}>Main Engine & Shaft Line</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>ME Length (m)</label><input type="number" name="main_engine_footprint_length" value={engineRoom.main_engine_footprint_length} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>ME Width (m)</label><input type="number" name="main_engine_footprint_width" value={engineRoom.main_engine_footprint_width} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>ME Height (m)</label><input type="number" name="main_engine_height" value={engineRoom.main_engine_height} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>ME Weight (t)</label><input type="number" name="main_engine_weight_tonnes" value={engineRoom.main_engine_weight_tonnes} onChange={handleInputChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div><label className={labelClass}>Shaft Centerline Z (m)</label><input type="number" name="shaft_centerline_z" value={engineRoom.shaft_centerline_z} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Shaft Angle (°)</label><input type="number" name="shaft_inclination_angle" value={engineRoom.shaft_inclination_angle} onChange={handleInputChange} className={inputClass} /></div>
          </div>

          {/* Casing & Steering Gear */}
          <div className={subSectionTitleClass}>Casing & Steering Gear</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Casing Length (m)</label><input type="number" name="casing_length" value={engineRoom.casing_length} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Casing Width (m)</label><input type="number" name="casing_width" value={engineRoom.casing_width} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Casing Start Deck</label><input name="casing_start_deck_id" value={engineRoom.casing_start_deck_id} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Casing End Deck</label><input name="casing_end_deck_id" value={engineRoom.casing_end_deck_id} onChange={handleInputChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Steering Gear Area (m²)</label><input type="number" name="steering_gear_area_m2" value={engineRoom.steering_gear_area_m2} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className={labelClass}>Steering Gear Frame</label><input type="number" name="steering_gear_frame" value={engineRoom.steering_gear_frame} onChange={handleInputChange} className={inputClass} /></div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div><label className={labelClass}>Notes</label><textarea name="notes" value={engineRoom.notes} onChange={handleInputChange} className={inputClass} rows={2} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineRoom;