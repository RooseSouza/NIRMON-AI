import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight, Layers3, Zap } from 'lucide-react';

const Machinery: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple machinery items with integrated zones
  const [machineryList, setMachineryList] = useState([
    {
      // Machinery Fields
      entry_type: 'New',
      machinery_type: '',
      machinery_category: '',
      machinery_name: '',
      manufacturer: '',
      model_number: '',
      quantity: 1,
      location_frame: '',
      location_x: '',
      elevation_z: '',
      footprint_length: '',
      footprint_breadth: '',
      footprint_area: '',
      height_required: '',
      weight_dry: '',
      weight_wet: '',
      power_output: '',
      power_consumption: '',
      deck_location: '',
      zone_preference: 'Any',
      side_preference: 'Center',
      maintenance_clearance_fwd: '0.5',
      maintenance_clearance_aft: '0.5',
      maintenance_clearance_port: '0.5',
      maintenance_clearance_stbd: '0.5',
      maintenance_clearance_above: '1.0',
      lifting_required: false,
      lifting_weight: '',
      ventilation_required: true,
      ventilation_cfm: '',
      foundation_type: 'Standard',
      priority: 'High',
      notes: '',
      // Integrated Zone Fields
      zone_name: '',
      zone_category: '',
      longitudinal_zone: 'Midship',
      start_frame: '',
      end_frame: '',
      deck_lower_id: '',
      deck_upper_id: '',
      min_zone_area: '',
      min_zone_height: '',
      fire_rating_required: 'A-60',
      access_type: 'Manhole',
      escape_routes_required: true
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

    const updatedList = [...machineryList];
    updatedList[index] = { ...updatedList[index], [name]: newValue };
    setMachineryList(updatedList);
  };

  const addMachinery = () => {
    setMachineryList([...machineryList, {
        entry_type: 'New',
        machinery_type: '',
        machinery_category: '',
        machinery_name: '',
        manufacturer: '',
        model_number: '',
        quantity: 1,
        location_frame: '',
        location_x: '',
        elevation_z: '',
        footprint_length: '',
        footprint_breadth: '',
        footprint_area: '',
        height_required: '',
        weight_dry: '',
        weight_wet: '',
        power_output: '',
        power_consumption: '',
        deck_location: '',
        zone_preference: 'Any',
        side_preference: 'Center',
        maintenance_clearance_fwd: '0.5',
        maintenance_clearance_aft: '0.5',
        maintenance_clearance_port: '0.5',
        maintenance_clearance_stbd: '0.5',
        maintenance_clearance_above: '1.0',
        lifting_required: false,
        lifting_weight: '',
        ventilation_required: true,
        ventilation_cfm: '',
        foundation_type: 'Standard',
        priority: 'High',
        notes: '',
        zone_name: '',
        zone_category: '',
        longitudinal_zone: 'Midship',
        start_frame: '',
        end_frame: '',
        deck_lower_id: '',
        deck_upper_id: '',
        min_zone_area: '',
        min_zone_height: '',
        fire_rating_required: 'A-60',
        access_type: 'Manhole',
        escape_routes_required: true
    }]);
  };

  const removeMachinery = (index: number) => {
    const updatedList = machineryList.filter((_, i) => i !== index);
    setMachineryList(updatedList);
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
    const payload = machineryList.map(item => ({
        ...item,
        quantity: parseInt(item.quantity.toString()) || 0,
        location_frame: parseInt(item.location_frame) || 0,
        location_x: parseFloat(item.location_x) || 0,
        elevation_z: parseFloat(item.elevation_z) || 0,
        footprint_length: parseFloat(item.footprint_length) || 0,
        footprint_breadth: parseFloat(item.footprint_breadth) || 0,
        footprint_area: parseFloat(item.footprint_area) || 0,
        height_required: parseFloat(item.height_required) || 0,
        weight_dry: parseFloat(item.weight_dry) || 0,
        weight_wet: parseFloat(item.weight_wet) || 0,
        power_output: parseFloat(item.power_output) || 0,
        power_consumption: parseFloat(item.power_consumption) || 0,
        maintenance_clearance_fwd: parseFloat(item.maintenance_clearance_fwd) || 0,
        maintenance_clearance_aft: parseFloat(item.maintenance_clearance_aft) || 0,
        maintenance_clearance_port: parseFloat(item.maintenance_clearance_port) || 0,
        maintenance_clearance_stbd: parseFloat(item.maintenance_clearance_stbd) || 0,
        maintenance_clearance_above: parseFloat(item.maintenance_clearance_above) || 0,
        lifting_weight: parseFloat(item.lifting_weight) || 0,
        ventilation_cfm: parseFloat(item.ventilation_cfm) || 0,
        start_frame: parseInt(item.start_frame) || 0,
        end_frame: parseInt(item.end_frame) || 0,
        min_zone_area: parseFloat(item.min_zone_area) || 0,
        min_zone_height: parseFloat(item.min_zone_height) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/machinery`, {
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
            setError(result.error || "Failed to save machinery data.");
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
            <button onClick={addMachinery} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Machinery & Zone
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Machinery & Zones</h1>
          <p className="text-sm text-gray-500 mt-1">Specify machinery items and their housing zones for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Machinery List Form */}
        <div className="space-y-6">
          {machineryList.map((item, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Machinery & Zone Definition</h3>
                </div>
                {machineryList.length > 1 && (
                    <button onClick={() => removeMachinery(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              {/* SECTION: Machinery General Info */}
              <div className={subSectionTitleClass}><Zap size={16} /> Machinery Information</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Type</label><input name="machinery_type" value={item.machinery_type} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Engine" /></div>
                <div><label className={labelClass}>Category</label><input name="machinery_category" value={item.machinery_category} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Main" /></div>
                <div><label className={labelClass}>Name</label><input name="machinery_name" value={item.machinery_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. ME 1" /></div>
                <div><label className={labelClass}>Quantity</label><input type="number" name="quantity" value={item.quantity} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* SECTION: Manufacturer */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div><label className={labelClass}>Manufacturer</label><input name="manufacturer" value={item.manufacturer} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Model Number</label><input name="model_number" value={item.model_number} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Entry Type</label>
                  <select name="entry_type" value={item.entry_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="New">New</option>
                    <option value="Existing">Existing</option>
                  </select>
                </div>
              </div>

              {/* SECTION: Location & Dimensions */}
              <div className={subSectionTitleClass}><Zap size={16} /> Location & Dimensions</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div><label className={labelClass}>Frame</label><input type="number" name="location_frame" value={item.location_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Loc X (m)</label><input type="number" name="location_x" value={item.location_x} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Elev Z (m)</label><input type="number" name="elevation_z" value={item.elevation_z} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Length (m)</label><input type="number" name="footprint_length" value={item.footprint_length} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Breadth (m)</label><input type="number" name="footprint_breadth" value={item.footprint_breadth} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div><label className={labelClass}>Area (m²)</label><input type="number" name="footprint_area" value={item.footprint_area} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Height (m)</label><input type="number" name="height_required" value={item.height_required} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Dry Weight (t)</label><input type="number" name="weight_dry" value={item.weight_dry} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Wet Weight (t)</label><input type="number" name="weight_wet" value={item.weight_wet} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Foundation</label>
                  <select name="foundation_type" value={item.foundation_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Standard">Standard</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
              </div>

              {/* SECTION: Zone Information */}
              <div className={subSectionTitleClass}><Layers3 size={16} /> Housing Zone Information</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Zone Name</label><input name="zone_name" value={item.zone_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Engine Room" /></div>
                <div><label className={labelClass}>Zone Category</label><input name="zone_category" value={item.zone_category} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Machinery" /></div>
                <div><label className={labelClass}>Zone Deck Loc</label><input name="deck_location" value={item.deck_location} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Long. Position</label>
                  <select name="longitudinal_zone" value={item.longitudinal_zone} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Forward">Forward</option>
                    <option value="Midship">Midship</option>
                    <option value="Aft">Aft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                <div><label className={labelClass}>Zone Start Frame</label><input type="number" name="start_frame" value={item.start_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Zone End Frame</label><input type="number" name="end_frame" value={item.end_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Zone Lower Deck</label><input name="deck_lower_id" value={item.deck_lower_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Zone Upper Deck</label><input name="deck_upper_id" value={item.deck_upper_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Min Zone Area</label><input type="number" name="min_zone_area" value={item.min_zone_area} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Min Zone Height</label><input type="number" name="min_zone_height" value={item.min_zone_height} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* SECTION: Preferences & Clearances */}
              <div className={subSectionTitleClass}>Service & Safety</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div><label className={labelClass}>Power Output (kW)</label><input type="number" name="power_output" value={item.power_output} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Power Cons. (kW)</label><input type="number" name="power_consumption" value={item.power_consumption} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Vent CFM</label><input type="number" name="ventilation_cfm" value={item.ventilation_cfm} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select name="priority" value={item.priority} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                    <label className={labelClass}>Fire Rating</label>
                    <select name="fire_rating_required" value={item.fire_rating_required} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="A-0">A-0</option>
                        <option value="A-60">A-60</option>
                        <option value="B-0">B-0</option>
                    </select>
                </div>
              </div>

              {/* SECTION: Maintenance & Clearances */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div><label className={labelClass}>Maint. Fwd</label><input type="number" name="maintenance_clearance_fwd" value={item.maintenance_clearance_fwd} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Maint. Aft</label><input type="number" name="maintenance_clearance_aft" value={item.maintenance_clearance_aft} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Maint. Port</label><input type="number" name="maintenance_clearance_port" value={item.maintenance_clearance_port} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Maint. Stbd</label><input type="number" name="maintenance_clearance_stbd" value={item.maintenance_clearance_stbd} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Maint. Above</label><input type="number" name="maintenance_clearance_above" value={item.maintenance_clearance_above} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* SECTION: Logistics & Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                <div className="flex gap-6 mt-4 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="lifting_required" checked={item.lifting_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Lifting Required
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="ventilation_required" checked={item.ventilation_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Ventilation Req.
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="escape_routes_required" checked={item.escape_routes_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Escape Routes
                  </label>
                </div>
                <div><label className={labelClass}>Lifting Weight (t)</label><input type="number" name="lifting_weight" value={item.lifting_weight} onChange={(e) => handleInputChange(index, e)} className={inputClass} disabled={!item.lifting_required}/></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Notes</label><textarea name="notes" value={item.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} rows={1} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Machinery;