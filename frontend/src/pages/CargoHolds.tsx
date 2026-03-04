import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight, Package } from 'lucide-react';

const CargoHolds: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple cargo holds
  const [cargoHolds, setCargoHolds] = useState([
    {
      hold_number: '',
      hold_name: '',
      start_frame: '',
      end_frame: '',
      deck_lower_id: '',
      deck_upper_id: '',
      target_volume_m3: '',
      grain_capacity_m3: '',
      bale_capacity_m3: '',
      hatch_opening_length: '',
      hatch_opening_width: '',
      hatch_center_frame: '',
      hatch_coaming_height: '',
      hatch_type: 'Flush',
      hatch_cover_type: 'Pontoon',
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

    const updatedHolds = [...cargoHolds];
    updatedHolds[index] = { ...updatedHolds[index], [name]: newValue };
    setCargoHolds(updatedHolds);
  };

  const addCargoHold = () => {
    setCargoHolds([...cargoHolds, {
        hold_number: '',
        hold_name: '',
        start_frame: '',
        end_frame: '',
        deck_lower_id: '',
        deck_upper_id: '',
        target_volume_m3: '',
        grain_capacity_m3: '',
        bale_capacity_m3: '',
        hatch_opening_length: '',
        hatch_opening_width: '',
        hatch_center_frame: '',
        hatch_coaming_height: '',
        hatch_type: 'Flush',
        hatch_cover_type: 'Pontoon',
        notes: ''
    }]);
  };

  const removeCargoHold = (index: number) => {
    const updatedHolds = cargoHolds.filter((_, i) => i !== index);
    setCargoHolds(updatedHolds);
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
    const payload = cargoHolds.map(hold => ({
        ...hold,
        start_frame: parseInt(hold.start_frame) || 0,
        end_frame: parseInt(hold.end_frame) || 0,
        target_volume_m3: parseFloat(hold.target_volume_m3) || 0,
        grain_capacity_m3: parseFloat(hold.grain_capacity_m3) || 0,
        bale_capacity_m3: parseFloat(hold.bale_capacity_m3) || 0,
        hatch_opening_length: parseFloat(hold.hatch_opening_length) || 0,
        hatch_opening_width: parseFloat(hold.hatch_opening_width) || 0,
        hatch_center_frame: parseInt(hold.hatch_center_frame) || 0,
        hatch_coaming_height: parseFloat(hold.hatch_coaming_height) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/cargo-holds`, {
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
            setError(result.error || "Failed to save cargo hold data.");
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
            <button onClick={addCargoHold} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Hold
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Cargo Holds</h1>
          <p className="text-sm text-gray-500 mt-1">Define cargo holds and hatches for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Cargo Hold List Form */}
        <div className="space-y-6">
          {cargoHolds.map((hold, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Cargo Hold Definition</h3>
                </div>
                {cargoHolds.length > 1 && (
                    <button onClick={() => removeCargoHold(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              {/* Hold Location & Volume */}
              <div className={subSectionTitleClass}><Package size={16} /> Hold Identification & Capacity</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Hold #</label><input name="hold_number" value={hold.hold_number} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. 1" /></div>
                <div><label className={labelClass}>Name</label><input name="hold_name" value={hold.hold_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Forward Hold" /></div>
                <div><label className={labelClass}>Start Frame</label><input type="number" name="start_frame" value={hold.start_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>End Frame</label><input type="number" name="end_frame" value={hold.end_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div><label className={labelClass}>Lower Deck ID</label><input name="deck_lower_id" value={hold.deck_lower_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Upper Deck ID</label><input name="deck_upper_id" value={hold.deck_upper_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Target Vol (m³)</label><input type="number" name="target_volume_m3" value={hold.target_volume_m3} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Grain Cap (m³)</label><input type="number" name="grain_capacity_m3" value={hold.grain_capacity_m3} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Bale Cap (m³)</label><input type="number" name="bale_capacity_m3" value={hold.bale_capacity_m3} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              {/* Hatch Details */}
              <div className={subSectionTitleClass}><Package size={16} /> Hatch Opening & Covers</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div><label className={labelClass}>Hatch Length (m)</label><input type="number" name="hatch_opening_length" value={hold.hatch_opening_length} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Hatch Width (m)</label><input type="number" name="hatch_opening_width" value={hold.hatch_opening_width} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Hatch Frame</label><input type="number" name="hatch_center_frame" value={hold.hatch_center_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Coaming Ht (m)</label><input type="number" name="hatch_coaming_height" value={hold.hatch_coaming_height} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                    <label className={labelClass}>Hatch Type</label>
                    <select name="hatch_type" value={hold.hatch_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Flush">Flush</option>
                        <option value="Raised">Raised</option>
                    </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Cover Type</label>
                    <select name="hatch_cover_type" value={hold.hatch_cover_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Pontoon">Pontoon</option>
                        <option value="Folding">Folding</option>
                        <option value="Rolling">Rolling</option>
                    </select>
                </div>
                <div className="md:col-span-2"><label className={labelClass}>Notes</label><input name="notes" value={hold.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CargoHolds;