import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, ChevronRight, Ruler, 
  Layers, Info, CheckCircle2, AlertCircle 
} from 'lucide-react';

const HullGeometry: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Logic to save to your backend/local storage
    setTimeout(() => {
      setIsSaving(false);
      alert("Hull Geometry saved successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> BACK TO DETAILS
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-white border border-gray-300 px-6 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Save size={18} className={isSaving ? "animate-spin" : ""} />
              {isSaving ? "SAVING..." : "SAVE"}
            </button>
            <button 
              onClick={() => alert("Proceeding to Compartments...")}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all"
            >
              NEXT <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Hull Geometry & Dimensions</h1>
        <p className="text-gray-500 mb-8 font-medium">Project Reference: <span className="text-blue-600">{projectId}</span></p>

        <div className="space-y-6">
          
          {/* 1. Principal Dimensions Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Ruler size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Principal Dimensions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormGroup label="Length Overall (LOA)" name="length_overall" value={formData.length_overall} onChange={handleChange} unit="meters" />
              <FormGroup label="Length B.P. (LBP)" name="length_between_perpendiculars" value={formData.length_between_perpendiculars} onChange={handleChange} unit="meters" />
              <FormGroup label="Breadth Moulded (B)" name="breadth_moulded" value={formData.breadth_moulded} onChange={handleChange} unit="meters" />
              <FormGroup label="Depth Moulded (D)" name="depth_moulded" value={formData.depth_moulded} onChange={handleChange} unit="meters" />
              <FormGroup label="Design Draft (T)" name="design_draft" value={formData.design_draft} onChange={handleChange} unit="meters" />
              <FormGroup label="Block Coefficient (Cb)" name="block_coefficient" value={formData.block_coefficient} onChange={handleChange} />
            </div>
          </div>

          {/* 2. Frame System Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Layers size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Frame & Coordinate System</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormGroup label="Frame Spacing" name="frame_spacing" value={formData.frame_spacing} onChange={handleChange} unit="mm" />
              <FormGroup label="Frame Origin" name="frame_numbering_origin" value={formData.frame_numbering_origin} onChange={handleChange} />
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Numbering Direction</label>
                <select 
                  name="frame_numbering_direction" 
                  value={formData.frame_numbering_direction}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Forward">Forward</option>
                  <option value="Aft">Aft</option>
                </select>
              </div>

              <FormGroup label="Baseline (Z=0)" name="baseline_z" value={formData.baseline_z} onChange={handleChange} />
              <FormGroup label="Centerline (Y=0)" name="centerline_y" value={formData.centerline_y} onChange={handleChange} />
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hull Form Type</label>
                <select 
                  name="hull_form_type" 
                  value={formData.hull_form_type}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Mono Hull">Mono Hull</option>
                  <option value="Catamaran">Catamaran</option>
                  <option value="Trimaran">Trimaran</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Engineering Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Engineering Notes & Design Constraints</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any specific notes regarding the hull geometry..."
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-bold">Validation Note:</span> Ensure LOA and LBP values are checked against class requirements before finalizing.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable Form Component to match your screenshot style
const FormGroup = ({ label, name, value, onChange, unit = "" }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
      {label}
      {unit && <span className="text-blue-500 normal-case italic font-medium">{unit}</span>}
    </label>
    <div className="relative">
      <input 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-slate-700 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
      />
      {value && <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
    </div>
  </div>
);

export default HullGeometry;