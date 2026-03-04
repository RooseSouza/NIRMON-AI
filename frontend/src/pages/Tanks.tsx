import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight } from 'lucide-react';

const Tanks: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple tanks
  const [tanks, setTanks] = useState([
    {
      tank_type: '',
      tank_category: '',
      tank_name: '',
      quantity: 1,
      start_frame: '',
      end_frame: '',
      deck_lower_id: '',
      deck_upper_id: '',
      double_bottom_height: '',
      hopper_slope_angle: '',
      topside_slope_angle: '',
      wing_tank_width: '',
      fluid_density: '1.025',
      inner_hull_offset: '',
      required_capacity_per_tank: '',
      total_capacity_required: '',
      max_fill_percentage: '98',
      location_vertical: 'Lower',
      location_longitudinal: 'Mid',
      side_preference: 'Center',
      structural_type: 'Integral',
      coating_required: false,
      heating_required: false,
      heating_temperature: '',
      sounding_pipe_required: true,
      vent_required: true,
      overflow_arrangement: '',
      priority: 'Medium',
      notes: ''
    }
  ]);

  // --- STYLES ---
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide";
  const sectionClass = "bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6";

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox specifically
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    const updatedTanks = [...tanks];
    updatedTanks[index] = { ...updatedTanks[index], [name]: newValue };
    setTanks(updatedTanks);
  };

  const addTank = () => {
    setTanks([...tanks, {
        tank_type: '',
        tank_category: '',
        tank_name: '',
        quantity: 1,
        start_frame: '',
        end_frame: '',
        deck_lower_id: '',
        deck_upper_id: '',
        double_bottom_height: '',
        hopper_slope_angle: '',
        topside_slope_angle: '',
        wing_tank_width: '',
        fluid_density: '1.025',
        inner_hull_offset: '',
        required_capacity_per_tank: '',
        total_capacity_required: '',
        max_fill_percentage: '98',
        location_vertical: 'Lower',
        location_longitudinal: 'Mid',
        side_preference: 'Center',
        structural_type: 'Integral',
        coating_required: false,
        heating_required: false,
        heating_temperature: '',
        sounding_pipe_required: true,
        vent_required: true,
        overflow_arrangement: '',
        priority: 'Medium',
        notes: ''
    }]);
  };

  const removeTank = (index: number) => {
    const updatedTanks = tanks.filter((_, i) => i !== index);
    setTanks(updatedTanks);
  };

  const handleSaveAndNavigate = async () => {
    if (!gaInputId) {
        setError("Missing GA Input Reference. Please go back and save parameters.");
        return;
    }
    
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    // Prepare payload (convert strings to numbers where necessary)
    const payload = tanks.map(tank => ({
        ...tank,
        quantity: parseInt(tank.quantity.toString()) || 0,
        start_frame: parseInt(tank.start_frame) || 0,
        end_frame: parseInt(tank.end_frame) || 0,
        double_bottom_height: parseFloat(tank.double_bottom_height) || 0,
        hopper_slope_angle: parseFloat(tank.hopper_slope_angle) || 0,
        topside_slope_angle: parseFloat(tank.topside_slope_angle) || 0,
        wing_tank_width: parseFloat(tank.wing_tank_width) || 0,
        fluid_density: parseFloat(tank.fluid_density) || 0,
        inner_hull_offset: parseFloat(tank.inner_hull_offset) || 0,
        required_capacity_per_tank: parseFloat(tank.required_capacity_per_tank) || 0,
        total_capacity_required: parseFloat(tank.total_capacity_required) || 0,
        max_fill_percentage: parseFloat(tank.max_fill_percentage) || 0,
        heating_temperature: parseFloat(tank.heating_temperature) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/tanks`, {
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
            setError(result.error || "Failed to save tank data.");
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
            <button onClick={addTank} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Tank
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Tank Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Define structural tanks for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Tank List Form */}
        <div className="space-y-6">
          {tanks.map((tank, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Tank Definition</h3>
                </div>
                {tanks.length > 1 && (
                    <button onClick={() => removeTank(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              {/* Grid 1: Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Type</label><input name="tank_type" value={tank.tank_type} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Fuel" /></div>
                <div><label className={labelClass}>Category</label><input name="tank_category" value={tank.tank_category} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. FOT" /></div>
                <div><label className={labelClass}>Name</label><input name="tank_name" value={tank.tank_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. FOT 1" /></div>
                <div><label className={labelClass}>Quantity</label><input type="number" name="quantity" value={tank.quantity} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Grid 2: Frames & Decks */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div><label className={labelClass}>Start Frame</label><input type="number" name="start_frame" value={tank.start_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>End Frame</label><input type="number" name="end_frame" value={tank.end_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Lower Deck ID</label><input name="deck_lower_id" value={tank.deck_lower_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Upper Deck ID</label><input name="deck_upper_id" value={tank.deck_upper_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Fluid Density</label><input type="number" step="0.001" name="fluid_density" value={tank.fluid_density} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Fill %</label><input type="number" name="max_fill_percentage" value={tank.max_fill_percentage} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Grid 3: Dimensions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>DB Height (m)</label><input type="number" name="double_bottom_height" value={tank.double_bottom_height} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Hopper Angle (°)</label><input type="number" name="hopper_slope_angle" value={tank.hopper_slope_angle} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Topside Angle (°)</label><input type="number" name="topside_slope_angle" value={tank.topside_slope_angle} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Wing Width (m)</label><input type="number" name="wing_tank_width" value={tank.wing_tank_width} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Grid 4: Capacities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Cap/Tank (m³)</label><input type="number" name="required_capacity_per_tank" value={tank.required_capacity_per_tank} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Total Cap (m³)</label><input type="number" name="total_capacity_required" value={tank.total_capacity_required} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Inner Hull Offset</label><input type="number" name="inner_hull_offset" value={tank.inner_hull_offset} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Heat Temp (°C)</label><input type="number" name="heating_temperature" value={tank.heating_temperature} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Grid 5: Locations & Preferences */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Vertical Loc</label>
                  <select name="location_vertical" value={tank.location_vertical} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Lower">Lower</option>
                    <option value="Upper">Upper</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Long. Loc</label>
                  <select name="location_longitudinal" value={tank.location_longitudinal} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Aft">Aft</option>
                    <option value="Mid">Mid</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Side</label>
                  <select name="side_preference" value={tank.side_preference} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Center">Center</option>
                    <option value="Port">Port</option>
                    <option value="Starboard">Starboard</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Struct Type</label>
                  <select name="structural_type" value={tank.structural_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Integral">Integral</option>
                    <option value="Independent">Independent</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select name="priority" value={tank.priority} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Overflow</label>
                  <input name="overflow_arrangement" value={tank.overflow_arrangement} onChange={(e) => handleInputChange(index, e)} className={inputClass} />
                </div>
              </div>

              {/* Grid 6: Checkboxes & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-2">
                    <label className={labelClass}>Notes</label>
                    <textarea name="notes" value={tank.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} rows={1} />
                </div>
                <div className="flex gap-4 mt-4 md:col-span-2 flex-wrap">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="coating_required" checked={tank.coating_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Coating
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="heating_required" checked={tank.heating_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Heating
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="sounding_pipe_required" checked={tank.sounding_pipe_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Sounding Pipe
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="vent_required" checked={tank.vent_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Vent
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tanks;