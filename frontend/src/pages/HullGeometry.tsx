import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Ruler, ChevronRight, 
  Info, Layers, Loader2, AlertCircle,
  Activity, Ship, Anchor
} from 'lucide-react';

const HullGeometry: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const gaInputId = location.state?.gaInputId;

  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- STYLES ---
  const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 font-mono";
  const labelClass = "block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex justify-between";

  const [formData, setFormData] = useState({
    length_overall: '', length_between_perpendiculars: '', breadth_moulded: '', depth_moulded: '', design_draft: '',
    baseline_z: '0', centerline_y: '0',
    block_coefficient: '0.80', prismatic_coefficient: '', midship_coefficient: '', waterplane_coefficient: '',
    parallel_midbody_length: '', entrance_length: '', run_length: '', bow_rake_angle: '', stern_rake_angle: '',
    bilge_radius: '', flare_angle: '', deadrise_angle: '',
    bulbous_bow: false, bulb_length: '', bulb_height: '', stern_type: 'Transom', skeg_enabled: false,
    frame_spacing: '0.7', frame_numbering_origin: 'AP', frame_numbering_direction: 'AFT_TO_FWD',
    hull_form_type: 'Mono Hull', notes: ''
  });

  useEffect(() => {
    if (!gaInputId) { alert("Session lost."); navigate(`/projects/${id}/input-parameter`); return; }
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) {
          const data = await response.json();
          setProjectDetails(data);
          if (data?.vessel) {
            setFormData(prev => ({
              ...prev,
              length_overall: data.vessel.loa || '', breadth_moulded: data.vessel.beam || '', design_draft: data.vessel.draft || '',
              depth_moulded: data.vessel.depth || '', length_between_perpendiculars: data.vessel.loa ? (data.vessel.loa * 0.95).toFixed(2) : ''
            }));
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (id) fetchData();
  }, [id, gaInputId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true); setError(null);
    const token = localStorage.getItem("token");

    if (!formData.length_overall || !formData.breadth_moulded) { setError("Principal Dimensions missing."); setIsSaving(false); return; }

    const payload = {
        length_overall: parseFloat(formData.length_overall),
        length_between_perpendiculars: parseFloat(formData.length_between_perpendiculars),
        breadth_moulded: parseFloat(formData.breadth_moulded),
        depth_moulded: parseFloat(formData.depth_moulded),
        design_draft: parseFloat(formData.design_draft),
        baseline_z: parseFloat(formData.baseline_z) || 0,
        centerline_y: parseFloat(formData.centerline_y) || 0,
        block_coefficient: parseFloat(formData.block_coefficient),
        prismatic_coefficient: parseFloat(formData.prismatic_coefficient) || null,
        midship_coefficient: parseFloat(formData.midship_coefficient) || null,
        waterplane_coefficient: parseFloat(formData.waterplane_coefficient) || null,
        parallel_midbody_length: parseFloat(formData.parallel_midbody_length) || 0,
        entrance_length: parseFloat(formData.entrance_length) || 0,
        run_length: parseFloat(formData.run_length) || 0,
        bow_rake_angle: parseFloat(formData.bow_rake_angle) || null,
        stern_rake_angle: parseFloat(formData.stern_rake_angle) || null,
        bilge_radius: parseFloat(formData.bilge_radius) || 0,
        flare_angle: parseFloat(formData.flare_angle) || null,
        deadrise_angle: parseFloat(formData.deadrise_angle) || null,
        bulbous_bow: formData.bulbous_bow,
        bulb_length: parseFloat(formData.bulb_length) || null,
        bulb_height: parseFloat(formData.bulb_height) || null,
        stern_type: formData.stern_type,
        skeg_enabled: formData.skeg_enabled,
        frame_spacing: parseFloat(formData.frame_spacing),
        frame_numbering_origin: formData.frame_numbering_origin,
        frame_numbering_direction: formData.frame_numbering_direction,
        hull_form_type: formData.hull_form_type,
        notes: formData.notes
    };

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/gainputs/${gaInputId}/hull`, {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok) { alert("Hull Created!"); navigate(`/projects/${id}`); } 
        else { setError(result.error || "Failed to save."); }
    } catch (err) { setError("Network error."); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600">
            <ArrowLeft size={16} /> BACK TO GA INPUT PARAMETERS
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <>Save & Finish <ChevronRight size={18} /></>}
          </button>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
        )}

        <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Hull Geometry Definition</h1>
            <p className="text-sm text-gray-500 mt-1">Project: <span className="font-medium text-blue-600">{projectDetails?.project_name}</span></p>
        </header>

        <div className="space-y-6">

          {/* SECTION 1 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Ruler className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Principal Dimensions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputField label="LOA" name="length_overall" value={formData.length_overall} onChange={handleChange} unit="m" />
              <InputField label="LBP" name="length_between_perpendiculars" value={formData.length_between_perpendiculars} onChange={handleChange} unit="m" />
              <InputField label="Beam" name="breadth_moulded" value={formData.breadth_moulded} onChange={handleChange} unit="m" />
              <InputField label="Depth" name="depth_moulded" value={formData.depth_moulded} onChange={handleChange} unit="m" />
              <InputField label="Draft" name="design_draft" value={formData.design_draft} onChange={handleChange} unit="m" />
              <InputField label="Baseline (Z)" name="baseline_z" value={formData.baseline_z} onChange={handleChange} unit="m" />
              <InputField label="Centerline (Y)" name="centerline_y" value={formData.centerline_y} onChange={handleChange} unit="m" />
              <div className="space-y-2">
                <label className={labelClass}>Hull Form</label>
                <select name="hull_form_type" value={formData.hull_form_type} onChange={handleChange} className={inputClass}>
                    <option>Mono Hull</option><option>Catamaran</option><option>Trimaran</option>
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Activity className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Hydrostatic Coefficients</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <InputField label="Block Coeff (Cb)" name="block_coefficient" value={formData.block_coefficient} onChange={handleChange} />
                <InputField label="Prismatic Coeff (Cp)" name="prismatic_coefficient" value={formData.prismatic_coefficient} onChange={handleChange} />
                <InputField label="Midship Coeff (Cm)" name="midship_coefficient" value={formData.midship_coefficient} onChange={handleChange} />
                <InputField label="Waterplane Coeff (Cwp)" name="waterplane_coefficient" value={formData.waterplane_coefficient} onChange={handleChange} />
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Ship className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Hull Shape & Distribution</h2>
            </div>
            <div className="mb-4"><h3 className="text-xs font-bold text-gray-400 uppercase">Longitudinal</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <InputField label="Entrance Length" name="entrance_length" value={formData.entrance_length} onChange={handleChange} unit="m" />
                <InputField label="Parallel Midbody" name="parallel_midbody_length" value={formData.parallel_midbody_length} onChange={handleChange} unit="m" />
                <InputField label="Run Length" name="run_length" value={formData.run_length} onChange={handleChange} unit="m" />
                <InputField label="Bow Rake Angle" name="bow_rake_angle" value={formData.bow_rake_angle} onChange={handleChange} unit="deg" />
                <InputField label="Stern Rake Angle" name="stern_rake_angle" value={formData.stern_rake_angle} onChange={handleChange} unit="deg" />
            </div>
            <div className="mb-4 border-t pt-4"><h3 className="text-xs font-bold text-gray-400 uppercase">Transverse Section</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Bilge Radius" name="bilge_radius" value={formData.bilge_radius} onChange={handleChange} unit="m" />
                <InputField label="Flare Angle" name="flare_angle" value={formData.flare_angle} onChange={handleChange} unit="deg" />
                <InputField label="Deadrise Angle" name="deadrise_angle" value={formData.deadrise_angle} onChange={handleChange} unit="deg" />
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Anchor className="text-blue-600 w-5 h-5" />
              <h2 className="font-bold text-gray-800">Appendages & Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <input type="checkbox" name="bulbous_bow" checked={formData.bulbous_bow} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                        <label className="font-bold text-gray-700 text-sm">Bulbous Bow Enabled</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Bulb Length" name="bulb_length" value={formData.bulb_length} onChange={handleChange} unit="m" />
                        <InputField label="Bulb Height" name="bulb_height" value={formData.bulb_height} onChange={handleChange} unit="m" />
                    </div>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <input type="checkbox" name="skeg_enabled" checked={formData.skeg_enabled} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                        <label className="font-bold text-gray-700 text-sm">Skeg Enabled</label>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Stern Type</label>
                        <select name="stern_type" value={formData.stern_type} onChange={handleChange} className={inputClass}>
                            <option>Transom</option><option>Cruiser</option><option>Elliptical</option>
                        </select>
                    </div>
                </div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <Layers className="text-blue-600 w-5 h-5" />
                    <h2 className="font-bold text-gray-800">Structural Grid</h2>
                </div>
                <div className="space-y-4">
                    <InputField label="Frame Spacing" name="frame_spacing" value={formData.frame_spacing} onChange={handleChange} unit="m" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Origin</label>
                            <select name="frame_numbering_origin" value={formData.frame_numbering_origin} onChange={handleChange} className={inputClass}><option value="AP">AP</option><option value="FP">FP</option><option value="MIDSHIP">Midship</option></select>
                        </div>
                        <div>
                            <label className={labelClass}>Direction</label>
                            <select name="frame_numbering_direction" value={formData.frame_numbering_direction} onChange={handleChange} className={inputClass}><option value="AFT_TO_FWD">Aft → Fwd</option><option value="FWD_TO_AFT">Fwd → Aft</option></select>
                        </div>
                    </div>
                </div>
             </div>
             <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <Info className="text-blue-600 w-5 h-5" />
                    <h2 className="font-bold text-gray-800">Engineering Notes</h2>
                </div>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={6} className={inputClass} placeholder="Specific requirements..."/>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, unit }: any) => (
  <div className="space-y-2">
    <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex justify-between">
      {label}
      {unit && <span className="text-blue-600 font-mono text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{unit}</span>}
    </label>
    <input name={name} value={value} onChange={onChange} type="number" step="0.01" className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 font-mono"/>
  </div>
);

export default HullGeometry;