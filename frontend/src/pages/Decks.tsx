import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight } from 'lucide-react';

const Decks: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple decks
  const [decks, setDecks] = useState([
    {
      deck_sequence: 1,
      deck_name: 'Main Deck',
      deck_code: 'MD',
      deck_elevation_z: '5.0',
      deck_type: 'Strength',
      is_watertight: true,
      is_freeboard_deck: true,
      camber_height: '0.1',
      sheer_forward: '0.5',
      sheer_aft: '0.2',
      longitudinal_start_frame: '0',
      longitudinal_end_frame: '100',
      deck_plate_thickness: '12',
      notes: ''
    }
  ]);

  // --- STYLES ---
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide";

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox specifically
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    const updatedDecks = [...decks];
    updatedDecks[index] = { ...updatedDecks[index], [name]: newValue };
    setDecks(updatedDecks);
  };

  const addDeck = () => {
    setDecks([...decks, {
      deck_sequence: decks.length + 1,
      deck_name: '',
      deck_code: '',
      deck_elevation_z: '',
      deck_type: 'Strength',
      is_watertight: false,
      is_freeboard_deck: false,
      camber_height: '',
      sheer_forward: '',
      sheer_aft: '',
      longitudinal_start_frame: '',
      longitudinal_end_frame: '',
      deck_plate_thickness: '',
      notes: ''
    }]);
  };

  const removeDeck = (index: number) => {
    const updatedDecks = decks.filter((_, i) => i !== index);
    // Re-sequence
    setDecks(updatedDecks.map((deck, i) => ({ ...deck, deck_sequence: i + 1 })));
  };

  // --- VALIDATION LOGIC ---
  const validateDecks = () => {
    for (const deck of decks) {
      if (parseInt(deck.longitudinal_start_frame) >= parseInt(deck.longitudinal_end_frame)) {
        setError(`Validation Error in ${deck.deck_name || 'unnamed deck'}: Start Frame must be less than End Frame.`);
        return false;
      }
      if (parseFloat(deck.deck_elevation_z) > 100 || parseFloat(deck.deck_elevation_z) < -50) {
        setError(`Validation Error in ${deck.deck_name || 'unnamed deck'}: Elevation seems unrealistic.`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!gaInputId) {
        setError("Missing GA Input Reference. Please go back and save parameters.");
        return;
    }
    
    if (!validateDecks()) return; // Run validation

    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    // Prepare payload
    const payload = decks.map(deck => ({
        ...deck,
        deck_elevation_z: parseFloat(deck.deck_elevation_z) || 0,
        camber_height: parseFloat(deck.camber_height) || 0,
        sheer_forward: parseFloat(deck.sheer_forward) || 0,
        sheer_aft: parseFloat(deck.sheer_aft) || 0,
        deck_plate_thickness: parseFloat(deck.deck_plate_thickness) || 0,
        longitudinal_start_frame: parseInt(deck.longitudinal_start_frame) || 0,
        longitudinal_end_frame: parseInt(deck.longitudinal_end_frame) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/decks`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert("Deck data saved successfully!");
        } else {
            const result = await response.json();
            setError(result.error || "Failed to save deck data.");
        }
    } catch (err) {
        setError("Network error occurred. Please check backend connection.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleSaveAndNavigate = async () => {
    if (!gaInputId) {
        setError("Missing GA Input Reference. Please go back and save parameters.");
        return;
    }
    
    if (!validateDecks()) return; // Run validation

    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    const payload = decks.map(deck => ({
        ...deck,
        deck_elevation_z: parseFloat(deck.deck_elevation_z) || 0,
        camber_height: parseFloat(deck.camber_height) || 0,
        sheer_forward: parseFloat(deck.sheer_forward) || 0,
        sheer_aft: parseFloat(deck.sheer_aft) || 0,
        deck_plate_thickness: parseFloat(deck.deck_plate_thickness) || 0,
        longitudinal_start_frame: parseInt(deck.longitudinal_start_frame) || 0,
        longitudinal_end_frame: parseInt(deck.longitudinal_end_frame) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/decks`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // Navigate to next step: Compartments
            navigate(`/projects/${id}/compartments`, { state: { gaInputId } });
        } else {
            const result = await response.json();
            setError(result.error || "Failed to save deck data.");
        }
    } catch (err) {
        setError("Network error occurred. Please check backend connection.");
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
            <ArrowLeft size={16} /> BACK TO PARAMETERS
          </button>
          <div className="flex gap-3">
            <button onClick={addDeck} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Deck
            </button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Decks
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Deck Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Project ID: <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Deck List */}
        <div className="space-y-6">
          {decks.map((deck, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{deck.deck_sequence}</div>
                    <h3 className="text-lg font-bold text-gray-800">Deck Configuration</h3>
                </div>
                {decks.length > 1 && (
                    <button onClick={() => removeDeck(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className={labelClass}>Deck Name</label><input name="deck_name" value={deck.deck_name} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Main Deck" /></div>
                <div><label className={labelClass}>Deck Code</label><input name="deck_code" value={deck.deck_code} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. MD" /></div>
                <div><label className={labelClass}>Elevation (Z) [m]</label><input type="number" name="deck_elevation_z" value={deck.deck_elevation_z} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Deck Type</label>
                  <select name="deck_type" value={deck.deck_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                    <option value="Strength">Strength</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Superstructure">Superstructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div><label className={labelClass}>Camber [m]</label><input type="number" name="camber_height" value={deck.camber_height} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Sheer Fwd [m]</label><input type="number" name="sheer_forward" value={deck.sheer_forward} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Sheer Aft [m]</label><input type="number" name="sheer_aft" value={deck.sheer_aft} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Start Frame</label><input type="number" name="longitudinal_start_frame" value={deck.longitudinal_start_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>End Frame</label><input type="number" name="longitudinal_end_frame" value={deck.longitudinal_end_frame} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-2">
                    <label className={labelClass}>Notes</label>
                    <textarea name="notes" value={deck.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} rows={1} />
                </div>
                <div>
                    <label className={labelClass}>Thickness [mm]</label>
                    <input type="number" name="deck_plate_thickness" value={deck.deck_plate_thickness} onChange={(e) => handleInputChange(index, e)} className={inputClass} />
                </div>
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="is_watertight" checked={deck.is_watertight} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Watertight
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="is_freeboard_deck" checked={deck.is_freeboard_deck} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" />
                    Freeboard Deck
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

export default Decks;