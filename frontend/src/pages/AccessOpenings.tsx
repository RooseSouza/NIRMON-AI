import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight, DoorOpen } from 'lucide-react';

const AccessOpenings: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple access openings
  const [openings, setOpenings] = useState([
    {
      opening_type: 'Manhole',
      opening_name: '',
      location_frame: '',
      location_x: '',
      location_y_side: 'Center',
      deck_lower_id: '',
      deck_upper_id: '',
      width: '',
      length: '',
      clear_height: '',
      ladder_type: 'Vertical',
      ladder_inclination_angle: '90',
      door_type: 'Watertight',
      door_fire_rating: 'A-0',
      is_escape_route: false,
      notes: ''
    }
  ]);

  // --- STYLES ---
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide";
  const sectionClass = "bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6";
  const subSectionTitleClass = "text-sm font-bold text-gray-700 mb-4 bg-gray-100 p-2 rounded flex items-center gap-2";

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox specifically
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    const updatedOpenings = [...openings];
    updatedOpenings[index] = { ...updatedOpenings[index], [name]: newValue };
    setOpenings(updatedOpenings);
  };

  const addOpening = () => {
    setOpenings([...openings, {
        opening_type: 'Manhole',
        opening_name: '',
        location_frame: '',
        location_x: '',
        location_y_side: 'Center',
        deck_lower_id: '',
        deck_upper_id: '',
        width: '',
        length: '',
        clear_height: '',
        ladder_type: 'Vertical',
        ladder_inclination_angle: '90',
        door_type: 'Watertight',
        door_fire_rating: 'A-0',
        is_escape_route: false,
        notes: ''
    }]);
  };

  const removeOpening = (index: number) => {
    const updatedOpenings = openings.filter((_, i) => i !== index);
    setOpenings(updatedOpenings);
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
    const payload = openings.map(op => ({
        ...op,
        location_frame: parseInt(op.location_frame) || 0,
        location_x: parseFloat(op.location_x) || 0,
        width: parseFloat(op.width) || 0,
        length: parseFloat(op.length) || 0,
        clear_height: parseFloat(op.clear_height) || 0,
        ladder_inclination_angle: parseFloat(op.ladder_inclination_angle) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/access-openings`, {
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
            setError(result.error || "Failed to save access opening data.");
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
          <div className="flex gap-3">
            <button onClick={addOpening} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Opening
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Access Openings</h1>
          <p className="text-sm text-gray-500 mt-1">Define hatches, doors, and ladders for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Opening List Form */}
        <div className="space-y-6">
          {openings.map((op, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Opening Definition</h3>
                </div>
                {openings.length > 1 && (
                    <button onClick={() => removeOpening(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              {/* General Info & Location */}
              <div className={subSectionTitleClass}><DoorOpen size={16} /> Location & Dimensions</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Type</label>
                    <select name="opening_type" value={op.opening_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Manhole">Manhole</option>
                        <option value="Door">Door</option>
                        <option value="Hatch">Hatch</option>
                        <option value="Ladder">Ladder</option>
                    </select>
                </div>
                <div><label className={labelClass}>Name</label><input name="opening_name" value={op.opening_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. H-01" /></div>
                <div><label className={labelClass}>Frame</label><input type="number" name="location_frame" value={op.location_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Location X (m)</label><input type="number" name="location_x" value={op.location_x} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                    <label className={labelClass}>Side</label>
                    <select name="location_y_side" value={op.location_y_side} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Center">Center</option>
                        <option value="Port">Port</option>
                        <option value="Starboard">Starboard</option>
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div><label className={labelClass}>Lower Deck ID</label><input name="deck_lower_id" value={op.deck_lower_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Upper Deck ID</label><input name="deck_upper_id" value={op.deck_upper_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Width (m)</label><input type="number" name="width" value={op.width} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Length (m)</label><input type="number" name="length" value={op.length} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Clear Height (m)</label><input type="number" name="clear_height" value={op.clear_height} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Ladder & Door Specifics */}
              <div className={subSectionTitleClass}>Technical Specifications</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className={labelClass}>Ladder Type</label>
                    <select name="ladder_type" value={op.ladder_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Vertical">Vertical</option>
                        <option value="Inclined">Inclined</option>
                    </select>
                </div>
                <div><label className={labelClass}>Ladder Angle (°)</label><input type="number" name="ladder_inclination_angle" value={op.ladder_inclination_angle} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                    <label className={labelClass}>Door Type</label>
                    <select name="door_type" value={op.door_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Watertight">Watertight</option>
                        <option value="Weathertight">Weathertight</option>
                        <option value="Non-tight">Non-tight</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Fire Rating</label>
                    <select name="door_fire_rating" value={op.door_fire_rating} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="A-0">A-0</option>
                        <option value="A-15">A-15</option>
                        <option value="A-30">A-30</option>
                        <option value="A-60">A-60</option>
                        <option value="B-0">B-0</option>
                    </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" name="is_escape_route" checked={op.is_escape_route} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" id={`escape-${index}`} />
                    <label htmlFor={`escape-${index}`} className="text-sm text-gray-700">Is Escape Route</label>
                </div>
                <div className="md:col-span-2"><label className={labelClass}>Notes</label><input name="notes" value={op.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessOpenings;