import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Ruler, ChevronRight, 
  Box, Info, CheckCircle2, Calculator, Ship,
  Layers, Settings2, AlertTriangle
} from 'lucide-react';

const HullGeometry: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    length_overall: '',
    length_between_perpendiculars: '',
    breadth_moulded: '',
    depth_moulded: '',
    design_draft: '',
    baseline_z: '',
    frame_spacing: '',
    frame_numbering_origin: '',
    frame_numbering_direction: '',
    centerline_y: '',
    hull_form_type: '',
    block_coefficient: '',
    notes: ''
  });

  useEffect(() => {
      const fetchProjectDetails = async () => {
        const token = localStorage.getItem("token");
  
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/api/projects/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            setProjectDetails(data); // backend returns object directly
          } else {
            console.error("Failed to fetch project");
          }
        } catch (error) {
          console.error("API Error:", error);
        } finally {
          setLoading(false);
        }
      };
  
      if (id) fetchProjectDetails();
    }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto">

      {/* Header Navigation (MATCHES InputParameter) */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} /> BACK TO PARAMETERS
        </button>

        <div className="flex gap-4">

          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            NEXT <ChevronRight size={18} />
          </button>
        </div>
      </div>

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

        {/* SECTION 1 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Ruler className="text-blue-500" />
            <h2 className="font-bold text-gray-700">
              Principal Dimensions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Length Overall (LOA)" name="length_overall" value={formData.length_overall} onChange={handleChange} unit="m" />
            <InputField label="Length B.P. (LBP)" name="length_between_perpendiculars" value={formData.length_between_perpendiculars} onChange={handleChange} unit="m" />
            <InputField label="Beam (B)" name="breadth_moulded" value={formData.breadth_moulded} onChange={handleChange} unit="m" />
            <InputField label="Depth (D)" name="depth_moulded" value={formData.depth_moulded} onChange={handleChange} unit="m" />
            <InputField label="Design Draft (T)" name="design_draft" value={formData.design_draft} onChange={handleChange} unit="m" />
            <InputField label="Block Coefficient" name="block_coefficient" value={formData.block_coefficient} onChange={handleChange} />
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Layers className="text-blue-500" />
            <h2 className="font-bold text-gray-700">
              Frame & Coordinate System
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Frame Spacing" name="frame_spacing" value={formData.frame_spacing} onChange={handleChange} unit="mm" />
            <InputField label="Frame Origin" name="frame_numbering_origin" value={formData.frame_numbering_origin} onChange={handleChange} />

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Numbering Direction
              </label>
              <select
                name="frame_numbering_direction"
                value={formData.frame_numbering_direction}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="Forward">Forward</option>
                <option value="Aft">Aft</option>
              </select>
            </div>

            <InputField label="Baseline (Z=0)" name="baseline_z" value={formData.baseline_z} onChange={handleChange} unit="m" />
            <InputField label="Centerline (Y=0)" name="centerline_y" value={formData.centerline_y} onChange={handleChange} unit="m" />

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Hull Form Type
              </label>
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

        {/* SECTION 3 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Info className="text-blue-500" />
            <h2 className="font-bold text-gray-700">
              Engineering Notes
            </h2>
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </section>

      </div>
    </div>
  </div>
);
};

// --- Sub-Components ---

const InputField = ({ label, name, value, onChange, unit = "" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
      {label}
      {unit && <span className="text-blue-500 font-mono">{unit}</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
    />
  </div>
);

export default HullGeometry;