import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Save, Trash2, Loader2, AlertCircle, ChevronRight, GitMerge } from 'lucide-react';

const AdjacencyRules: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId; // Received from previous page

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage multiple adjacency rules
  const [rules, setRules] = useState([
    {
      entity1_type: 'Compartment',
      entity1_id: '',
      entity2_type: 'Machinery',
      entity2_id: '',
      relationship_type: 'Adjacent',
      min_distance: '',
      max_distance: '',
      deck_relation: 'Same',
      rule_source: 'Owner Requirement',
      priority: 'Medium',
      is_active: true,
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

    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [name]: newValue };
    setRules(updatedRules);
  };

  const addRule = () => {
    setRules([...rules, {
        entity1_type: 'Compartment',
        entity1_id: '',
        entity2_type: 'Machinery',
        entity2_id: '',
        relationship_type: 'Adjacent',
        min_distance: '',
        max_distance: '',
        deck_relation: 'Same',
        rule_source: 'Owner Requirement',
        priority: 'Medium',
        is_active: true,
        notes: ''
    }]);
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
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
    const payload = rules.map(rule => ({
        ...rule,
        min_distance: parseFloat(rule.min_distance) || 0,
        max_distance: parseFloat(rule.max_distance) || 0,
    }));

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/adjacency-rules`, {
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
            setError(result.error || "Failed to save adjacency rules.");
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
            <button onClick={addRule} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                <PlusCircle size={16} /> Add Rule
            </button>
            <button onClick={handleSaveAndNavigate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Next Step <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GA Input - Adjacency Rules</h1>
          <p className="text-sm text-gray-500 mt-1">Define relative positioning rules for project <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{id}</span></p>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        {/* Rule List Form */}
        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div key={index} className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800">Rule Definition</h3>
                </div>
                {rules.length > 1 && (
                    <button onClick={() => removeRule(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
              </div>

              {/* Entity 1 */}
              <div className={subSectionTitleClass}><GitMerge size={16} /> Entity 1</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Type</label>
                    <select name="entity1_type" value={rule.entity1_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Compartment">Compartment</option>
                        <option value="Tank">Tank</option>
                        <option value="Machinery">Machinery</option>
                    </select>
                </div>
                <div className="col-span-3"><label className={labelClass}>ID / Name</label><input name="entity1_id" value={rule.entity1_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Engine Room" /></div>
              </div>

              {/* Entity 2 */}
              <div className={subSectionTitleClass}><GitMerge size={16} /> Entity 2</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className={labelClass}>Type</label>
                    <select name="entity2_type" value={rule.entity2_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Compartment">Compartment</option>
                        <option value="Tank">Tank</option>
                        <option value="Machinery">Machinery</option>
                    </select>
                </div>
                <div className="col-span-3"><label className={labelClass}>ID / Name</label><input name="entity2_id" value={rule.entity2_id} onChange={(e) => handleInputChange(index, e)} className={inputClass} placeholder="e.g. Fuel Tank 1" /></div>
              </div>

              {/* Rules and Constraints */}
              <div className={subSectionTitleClass}>Relationship Constraints</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Relation</label>
                    <select name="relationship_type" value={rule.relationship_type} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Adjacent">Adjacent</option>
                        <option value="Above">Above</option>
                        <option value="Below">Below</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div><label className={labelClass}>Min Dist (m)</label><input type="number" name="min_distance" value={rule.min_distance} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div><label className={labelClass}>Max Dist (m)</label><input type="number" name="max_distance" value={rule.max_distance} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div>
                    <label className={labelClass}>Deck Relation</label>
                    <select name="deck_relation" value={rule.deck_relation} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Same">Same</option>
                        <option value="Adjacent">Adjacent</option>
                        <option value="Any">Any</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Priority</label>
                    <select name="priority" value={rule.priority} onChange={(e) => handleInputChange(index, e)} className={inputClass}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
              </div>
              
              {/* Source & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2"><label className={labelClass}>Rule Source</label><input name="rule_source" value={rule.rule_source} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div className="md:col-span-2"><label className={labelClass}>Notes</label><input name="notes" value={rule.notes} onChange={(e) => handleInputChange(index, e)} className={inputClass} /></div>
                <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" name="is_active" checked={rule.is_active} onChange={(e) => handleInputChange(index, e)} className="rounded text-blue-600" id={`active-${index}`} />
                    <label htmlFor={`active-${index}`} className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdjacencyRules;