import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Ruler, ChevronRight, 
  Box, Info, CheckCircle2, Calculator, Ship,
  Layers, Settings2, AlertTriangle
} from 'lucide-react';

const HullGeometry: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    length_overall: '120.00',
    length_between_perpendiculars: '114.50',
    breadth_moulded: '16.00',
    depth_moulded: '9.00',
    design_draft: '5.00',
    baseline_z: '0',
    frame_spacing: '600',
    frame_numbering_origin: 'Aft Peak',
    frame_numbering_direction: 'Forward',
    centerline_y: '0',
    hull_form_type: 'Mono Hull',
    block_coefficient: '0.62',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0a1128] text-slate-200 p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">GA Input Module – <span className="text-blue-400">Principal Dimensions</span></h1>
              <div className="flex gap-4 mt-1">
                <span className="text-xs text-slate-500">Project: <span className="text-slate-300 font-mono">{projectId?.slice(0,12)}...</span></span>
                <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">Units: Meters (m)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-all">
              <Settings2 size={16} /> SETUP
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20">
              <Save size={16} /> SAVE GEOMETRY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Technical Inputs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Principal Dimensions */}
            <div className="bg-[#111c44] border border-slate-700/50 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-3">
                <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400">
                  <Ruler size={20} />
                </div>
                <h2 className="font-bold text-white uppercase text-sm tracking-widest">1. Principal Dimensions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="Length Overall (LOA)" name="length_overall" value={formData.length_overall} onChange={handleChange} unit="m" />
                <InputField label="Length B.P. (LBP)" name="length_between_perpendiculars" value={formData.length_between_perpendiculars} onChange={handleChange} unit="m" />
                <InputField label="Beam / Breadth (B)" name="breadth_moulded" value={formData.breadth_moulded} onChange={handleChange} unit="m" />
                <InputField label="Depth (D)" name="depth_moulded" value={formData.depth_moulded} onChange={handleChange} unit="m" />
                <InputField label="Design Draft (T)" name="design_draft" value={formData.design_draft} onChange={handleChange} unit="m" />
                <InputField label="Block Coeff. (Cb)" name="block_coefficient" value={formData.block_coefficient} onChange={handleChange} unit="dim" />
              </div>
            </div>

            {/* 2. Frame & Coordinate System */}
            <div className="bg-[#111c44] border border-slate-700/50 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-3">
                <div className="bg-purple-500/20 p-1.5 rounded-lg text-purple-400">
                  <Layers size={20} />
                </div>
                <h2 className="font-bold text-white uppercase text-sm tracking-widest">2. Frame & Coordinate System</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="Frame Spacing" name="frame_spacing" value={formData.frame_spacing} onChange={handleChange} unit="mm" />
                <InputField label="Frame Origin" name="frame_numbering_origin" value={formData.frame_numbering_origin} onChange={handleChange} placeholder="e.g. Aft Peak" />
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Numbering Direction</label>
                   <select name="frame_numbering_direction" value={formData.frame_numbering_direction} onChange={handleChange} className="w-full bg-[#0a1128] border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500">
                     <option value="Forward">Forward</option>
                     <option value="Aft">Aft</option>
                   </select>
                </div>
                <InputField label="Baseline (Z=0)" name="baseline_z" value={formData.baseline_z} onChange={handleChange} unit="m" />
                <InputField label="Centerline (Y=0)" name="centerline_y" value={formData.centerline_y} onChange={handleChange} unit="m" />
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Hull Form Type</label>
                   <select name="hull_form_type" value={formData.hull_form_type} onChange={handleChange} className="w-full bg-[#0a1128] border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500">
                     <option value="Mono Hull">Mono Hull</option>
                     <option value="Catamaran">Catamaran</option>
                     <option value="Trimaran">Trimaran</option>
                   </select>
                </div>
              </div>
            </div>

            {/* 3. Engineering Notes */}
            <div className="bg-[#111c44]/50 border border-slate-700/30 rounded-xl p-6">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Engineering Notes</h2>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter specific hull design constraints or observations..."
                  rows={2}
                  className="w-full bg-[#0a1128] border border-slate-700 rounded-lg p-3 text-slate-300 text-sm outline-none focus:border-blue-500"
                />
            </div>
          </div>

          {/* RIGHT COLUMN: Visuals & Validation */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Visual Reference Illustration */}
            <div className="bg-[#111c44] border border-slate-700/50 rounded-xl p-6 shadow-xl relative overflow-hidden">
               <h2 className="text-sm font-bold text-white uppercase mb-4">Visual Reference</h2>
               <div className="h-56 bg-slate-900/80 rounded-lg flex flex-col items-center justify-center border border-blue-500/20 relative group">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  
                  {/* Mockup Vessel Outline */}
                  <Ship size={120} className="text-blue-500/20 mb-4" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-blue-400/60">
                    <span>AFT</span>
                    <div className="flex-1 border-b border-dashed border-blue-500/30 mx-2 self-center"></div>
                    <span>FORWARD</span>
                  </div>

                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/20"></div>
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-blue-500/20"></div>
               </div>
               
               <div className="mt-4 space-y-2">
                 <DerivedStat label="L/B Ratio" value={(parseFloat(formData.length_overall) / parseFloat(formData.breadth_moulded)).toFixed(2)} status="Ideal" />
                 <DerivedStat label="L/D Ratio" value={(parseFloat(formData.length_overall) / parseFloat(formData.depth_moulded)).toFixed(2)} status="Good" />
               </div>
            </div>

            {/* Validation Panel */}
            <div className="bg-[#0f172a] border border-slate-700 rounded-xl p-6 shadow-inner">
               <h2 className="text-sm font-bold text-white uppercase mb-4 tracking-wider">Validation Status</h2>
               <div className="space-y-3">
                  <ValidationLine label="LOA > LBP > Beam" pass={true} />
                  <ValidationLine label="Depth > Draft" pass={true} />
                  <ValidationLine label="Block Coefficient Range" pass={true} />
                  <ValidationLine label="Frame Spacing Valid" pass={true} />
               </div>
               <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-xs font-bold text-green-400">Geometry Validation Successful</span>
               </div>
            </div>

            {/* Final Action */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-1 shadow-lg shadow-blue-900/20">
              <button 
                onClick={() => alert("Generating GA Layout...")}
                className="w-full bg-[#111c44]/20 hover:bg-transparent transition-all py-4 rounded-lg flex items-center justify-center gap-3 text-white font-bold"
              >
                GENERATE GA LAYOUT <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
               <AlertTriangle className="text-yellow-600 shrink-0" size={16} />
               <p className="text-[10px] text-yellow-600/80 leading-relaxed">
                 Ensure Frame Spacing matches the structural profile. Frame numbering direction impacts offset table generation.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const InputField = ({ label, name, value, onChange, placeholder = "", unit = "" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between tracking-wide">
      {label} {unit && <span className="text-blue-500/70 font-mono text-[9px]">{unit}</span>}
    </label>
    <div className="relative">
      <input 
        name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-[#0a1128] border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none font-mono"
      />
      {value && <div className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
    </div>
  </div>
);

const DerivedStat = ({ label, value, status }) => (
  <div className="flex justify-between items-center bg-[#0a1128]/50 p-2.5 rounded-lg border border-slate-800">
    <span className="text-[11px] text-slate-400">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-white font-mono">{value}</span>
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">{status}</span>
    </div>
  </div>
);

const ValidationLine = ({ label, pass }) => (
  <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
    <span className="text-xs text-slate-400">{label}</span>
    <span className={`text-[10px] font-bold ${pass ? 'text-green-400' : 'text-red-400'}`}>
      {pass ? 'PASS' : 'FAIL'}
    </span>
  </div>
);

export default HullGeometry;