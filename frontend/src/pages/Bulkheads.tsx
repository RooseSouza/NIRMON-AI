import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight, Binary } from 'lucide-react';

const Bulkheads: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple bulkheads
  const [bulkheads, setBulkheads] = useState([
    {
      bulkhead_name: '',
      bulkhead_type: 'Transverse',
      integrity_type: 'Watertight',
      location_type: 'Frame',
      location_value: '',
      location_frame: '',
      extent_bottom_z: '',
      extent_top_z: '',
      extent_top_deck_id: '',
      bulkhead_thickness: '',
      stiffening_type: 'Vertical',
      regulatory_classification: 'Class',
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

    const updatedBulkheads = [...bulkheads];
    updatedBulkheads[index] = { ...updatedBulkheads[index], [name]: newValue };
    setBulkheads(updatedBulkheads);
  };

  const addBulkhead = () => {
    setBulkheads([...bulkheads, {
        bulkhead_name: '',
        bulkhead_type: 'Transverse',
        integrity_type: 'Watertight',
        location_type: 'Frame',
        location_value: '',
        location_frame: '',
        extent_bottom_z: '',
        extent_top_z: '',
        extent_top_deck_id: '',
        bulkhead_thickness: '',
        stiffening_type: 'Vertical',
        regulatory_classification: 'Class',
        notes: ''
    }]);
  };

  const removeBulkhead = (index: number) => {
    const updatedBulkheads = bulkheads.filter((_, i) => i !== index);
    setBulkheads(updatedBulkheads);
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
    const payload = bulkheads.map(bh => ({
        ...bh,
        location_value: parseFloat(bh.location_value) || 0,
        location_frame: parseInt(bh.location_frame) || 0,
        extent_bottom_z: parseFloat(bh.extent_bottom_z) || 0,
        extent_top_z: parseFloat(bh.extent_top_z) || 0,
        bulkhead_thickness: parseFloat(bh.bulkhead_thickness) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/bulkheads`, {
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
            setError(result.error || "Failed to save bulkhead data.");
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
            <button onClick={addBulkhead} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Bulkhead
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Bulkheads</h1>
          <p className="text-sm text-gray-500 mt-1">Define structural bulkheads for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Bulkhead List Form */}
        <div className="space-y-6">
          {bulkheads.map((bh, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Bulkhead Definition</h3>
                </div>
                {bulkheads.length > 1 && (
                    <button onClick={() => removeBulkhead(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              {/* General Info */}
              <div className={subSectionTitleClass}><Binary size={16} /> General Properties</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Name</label><input name="bulkhead_name" value={bh.bulkhead_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. BHD 10" /></div>
                <div>
                    <label className={labelClass}>Type</label>
                    <select name="bulkhead_type" value={bh.bulkhead_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Transverse">Transverse</option>
                        <option value="Longitudinal">Longitudinal</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Integrity</label>
                    <select name="integrity_type" value={bh.integrity_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Watertight">Watertight</option>
                        <option value="Oiltight">Oiltight</option>
                        <option value="Non-tight">Non-tight</option>
                    </select>
                </div>
                <div><label className={labelClass}>Thickness (mm)</label><input type="number" name="bulkhead_thickness" value={bh.bulkhead_thickness} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Location */}
              <div className={subSectionTitleClass}>Location & Extent</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Loc. Type</label>
                    <select name="location_type" value={bh.location_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Frame">Frame</option>
                        <option value="Coordinate">Coordinate (X)</option>
                    </select>
                </div>
                <div><label className={labelClass}>Loc. Value / Frame</label><input type="number" name="location_value" value={bh.location_value} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Bottom Z (m)</label><input type="number" name="extent_bottom_z" value={bh.extent_bottom_z} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Top Z (m)</label><input type="number" name="extent_top_z" value={bh.extent_top_z} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Top Deck ID</label><input name="extent_top_deck_id" value={bh.extent_top_deck_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Classification & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                    <label className={labelClass}>Stiffening</label>
                    <select name="stiffening_type" value={bh.stiffening_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Vertical">Vertical</option>
                        <option value="Horizontal">Horizontal</option>
                        <option value="Grid">Grid</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Regulatory Class</label>
                    <input name="regulatory_classification" value={bh.regulatory_classification} onChange={(e) => handleInputChange(index, e)} className={inputClass} />
                </div>
                <div><label className={labelClass}>Notes</label><input name="notes" value={bh.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bulkheads;