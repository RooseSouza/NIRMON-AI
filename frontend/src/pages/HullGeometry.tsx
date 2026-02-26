import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Ruler, ChevronRight, 
  Info, Layers, Loader2, AlertCircle
} from 'lucide-react';

const HullGeometry: React.FC = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve gaInputId passed from the previous page
  const gaInputId = location.state?.gaInputId;

  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    length_overall: '',
    length_between_perpendiculars: '',
    breadth_moulded: '',
    depth_moulded: '',
    design_draft: '',
    
    baseline_z: '0',
    frame_spacing: '0.7', // Default 700mm converted to m, or user enters mm
    frame_numbering_origin: 'AP',
    frame_numbering_direction: 'AFT_TO_FWD',
    centerline_y: '0',
    
    hull_form_type: 'Mono Hull',
    block_coefficient: '0.80',
    notes: ''
  });

  // ================= FETCH PROJECT & PREFILL =================
  useEffect(() => {
    // Safety check: If page refreshed and state lost, redirect back
    if (!gaInputId) {
      alert("Session lost. Please start from Input Parameters.");
      navigate(`/projects/${id}/input-parameter`);
      return;
    }

    const fetchProjectDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/projects/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          setProjectDetails(data);

          // PREFILL FORM WITH VESSEL DATA
          if (data?.vessel) {
            setFormData(prev => ({
              ...prev,
              length_overall: data.vessel.loa || '',
              breadth_moulded: data.vessel.beam || '',
              design_draft: data.vessel.draft || '',
              depth_moulded: data.vessel.depth || '',
              // Estimate LBP usually slightly less than LOA if not provided
              length_between_perpendiculars: data.vessel.loa ? (data.vessel.loa * 0.95).toFixed(2) : ''
            }));
          }
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProjectDetails();
  }, [id, gaInputId, navigate]);

  // ================= HANDLERS =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    // 1. Validation
    if (!formData.length_overall || !formData.breadth_moulded || !formData.frame_spacing) {
        setError("Please fill in all Principal Dimensions and Frame settings.");
        setIsSaving(false);
        return;
    }

    // 2. Prepare Payload (Convert strings to numbers)
    const payload = {
        length_overall: parseFloat(formData.length_overall),
        length_between_perpendiculars: parseFloat(formData.length_between_perpendiculars),
        breadth_moulded: parseFloat(formData.breadth_moulded),
        depth_moulded: parseFloat(formData.depth_moulded),
        design_draft: parseFloat(formData.design_draft),
        
        baseline_z: parseFloat(formData.baseline_z) || 0,
        frame_spacing: parseFloat(formData.frame_spacing), // Ensure unit consistency (m or mm)
        
        frame_numbering_origin: formData.frame_numbering_origin,
        frame_numbering_direction: formData.frame_numbering_direction,
        centerline_y: parseFloat(formData.centerline_y) || 0,
        
        hull_form_type: formData.hull_form_type,
        block_coefficient: parseFloat(formData.block_coefficient),
        notes: formData.notes
    };

    try {
        // 3. API Call
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/hull`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            // Success - Navigate to Dashboard or Next Step (e.g., General Arrangement View)
            // For now, going back to project details or a success page
            alert("Hull Geometry Saved Successfully!");
            navigate(`/projects/${id}`); 
        } else {
            setError(result.error || "Failed to save Hull Geometry.");
        }
    } catch (err) {
        console.error(err);
        setError("Network error occurred.");
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} /> BACK TO PARAMETERS
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>SAVE & FINISH <ChevronRight size={18} /></>}
          </button>
        </div>

        {/* Error Banner */}
        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        <div className="space-y-8">

          {/* PAGE HEADER */}
          <header>
            <h1 className="text-2xl font-bold text-gray-800">
              Hull Geometry – Principal Dimensions
            </h1>
            <p className="text-sm text-gray-500">
              Project:{" "}
              <span className="font-semibold text-blue-600">
                {projectDetails?.project_name}
              </span>{" "}
              ({projectDetails?.project_code})
            </p>
          </header>

          {/* SECTION 1: DIMENSIONS */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Ruler className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Principal Dimensions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Length Overall (LOA)" name="length_overall" value={formData.length_overall} onChange={handleChange} unit="m" />
              <InputField label="Length B.P. (LBP)" name="length_between_perpendiculars" value={formData.length_between_perpendiculars} onChange={handleChange} unit="m" />
              <InputField label="Beam (B)" name="breadth_moulded" value={formData.breadth_moulded} onChange={handleChange} unit="m" />
              <InputField label="Depth (D)" name="depth_moulded" value={formData.depth_moulded} onChange={handleChange} unit="m" />
              <InputField label="Design Draft (T)" name="design_draft" value={formData.design_draft} onChange={handleChange} unit="m" />
              <InputField label="Block Coefficient (Cb)" name="block_coefficient" value={formData.block_coefficient} onChange={handleChange} />
            </div>
          </section>

          {/* SECTION 2: FRAMES */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Layers className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Frame & Coordinate System</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Frame Spacing" name="frame_spacing" value={formData.frame_spacing} onChange={handleChange} unit="m" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frame Origin</label>
                <select
                  name="frame_numbering_origin"
                  value={formData.frame_numbering_origin}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="AP">Aft Perpendicular (AP)</option>
                  <option value="FP">Fwd Perpendicular (FP)</option>
                  <option value="MIDSHIP">Midship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Numbering Direction</label>
                <select
                  name="frame_numbering_direction"
                  value={formData.frame_numbering_direction}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="AFT_TO_FWD">Aft to Fwd (Increasing Fwd)</option>
                  <option value="FWD_TO_AFT">Fwd to Aft (Increasing Aft)</option>
                </select>
              </div>

              <InputField label="Baseline (Z=0)" name="baseline_z" value={formData.baseline_z} onChange={handleChange} unit="m" />
              <InputField label="Centerline (Y=0)" name="centerline_y" value={formData.centerline_y} onChange={handleChange} unit="m" />

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hull Form Type</label>
                <select
                  name="hull_form_type"
                  value={formData.hull_form_type}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="Mono Hull">Mono Hull</option>
                  <option value="Catamaran">Catamaran</option>
                  <option value="Trimaran">Trimaran</option>
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 3: NOTES */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Info className="text-blue-500" />
              <h2 className="font-bold text-gray-700">Engineering Notes</h2>
            </div>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Enter any specific requirements for hull generation..."
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </section>

        </div>
      </div>
    </div>
  );
};

// --- Sub-Component for Clean Code ---
interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unit?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, unit }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
      {label}
      {unit && <span className="text-blue-500 font-mono text-[9px] bg-blue-50 px-1 rounded">{unit}</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type="number" 
      step="0.01" // Allows decimals
      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-gray-700"
    />
  </div>
);

export default HullGeometry;