import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight, LayoutGrid } from 'lucide-react';

const Compartments: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple compartments
  const [compartments, setCompartments] = useState([
    {
      compartment_type: '',
      compartment_category: '',
      compartment_name: '',
      quantity: 1,
      start_frame: '',
      end_frame: '',
      deck_lower_id: '',
      deck_upper_id: '',
      location_y_side: 'Center',
      min_area_per_unit: '',
      max_area_per_unit: '',
      min_height: '',
      occupancy: 0,
      deck_preference: 'Any',
      zone_preference: 'Any',
      side_preference: 'Center',
      natural_light_required: false,
      ventilation_type: 'Natural',
      fire_rating: '',
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

    const updatedCompartments = [...compartments];
    updatedCompartments[index] = { ...updatedCompartments[index], [name]: newValue };
    setCompartments(updatedCompartments);
  };

  const addCompartment = () => {
    setCompartments([...compartments, {
      compartment_type: '',
      compartment_category: '',
      compartment_name: '',
      quantity: 1,
      start_frame: '',
      end_frame: '',
      deck_lower_id: '',
      deck_upper_id: '',
      location_y_side: 'Center',
      min_area_per_unit: '',
      max_area_per_unit: '',
      min_height: '',
      occupancy: 0,
      deck_preference: 'Any',
      zone_preference: 'Any',
      side_preference: 'Center',
      natural_light_required: false,
      ventilation_type: 'Natural',
      fire_rating: '',
      priority: 'Medium',
      notes: ''
    }]);
  };

  const removeCompartment = (index: number) => {
    const updatedCompartments = compartments.filter((_, i) => i !== index);
    setCompartments(updatedCompartments);
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
    const payload = compartments.map(comp => ({
        ...comp,
        quantity: parseInt(comp.quantity.toString()) || 0,
        start_frame: parseInt(comp.start_frame) || 0,
        end_frame: parseInt(comp.end_frame) || 0,
        min_area_per_unit: parseFloat(comp.min_area_per_unit) || 0,
        max_area_per_unit: parseFloat(comp.max_area_per_unit) || 0,
        min_height: parseFloat(comp.min_height) || 0,
        occupancy: parseInt(comp.occupancy.toString()) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/compartments`, {
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
            setError(result.error || "Failed to save compartment data.");
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
            <button onClick={addCompartment} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Compartment
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Compartment Management</h1>
          <p className="text-sm text-gray-500 mt-1">Define structural compartments for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Compartment List Form */}
        <div className="space-y-6">
          {compartments.map((comp, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Compartment Definition</h3>
                </div>
                {compartments.length > 1 && (
                    <button onClick={() => removeCompartment(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Type</label><input name="compartment_type" value={comp.compartment_type} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Tank" /></div>
                <div><label className={labelClass}>Category</label><input name="compartment_category" value={comp.compartment_category} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Fuel" /></div>
                <div><label className={labelClass}>Name</label><input name="compartment_name" value={comp.compartment_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. FOT 1" /></div>
                <div><label className={labelClass}>Quantity</label><input type="number" name="quantity" value={comp.quantity} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div><label className={labelClass}>Start Frame</label><input type="number" name="start_frame" value={comp.start_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>End Frame</label><input type="number" name="end_frame" value={comp.end_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Lower Deck ID</label><input name="deck_lower_id" value={comp.deck_lower_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Upper Deck ID</label><input name="deck_upper_id" value={comp.deck_upper_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Min Area (m²)</label><input type="number" name="min_area_per_unit" value={comp.min_area_per_unit} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Max Area (m²)</label><input type="number" name="max_area_per_unit" value={comp.max_area_per_unit} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div><label className={labelClass}>Min Height (m)</label><input type="number" name="min_height" value={comp.min_height} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Occupancy</label><input type="number" name="occupancy" value={comp.occupancy} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Fire Rating</label><input name="fire_rating" value={comp.fire_rating} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Ventilation</label>
                  <select name="ventilation_type" value={comp.ventilation_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Natural">Natural</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select name="priority" value={comp.priority} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-2">
                    <label className={labelClass}>Notes</label>
                    <textarea name="notes" value={comp.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} rows={1} />
                </div>
                <div className="flex gap-6 mt-4 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="natural_light_required" checked={comp.natural_light_required} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Natural Light
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

export default Compartments;