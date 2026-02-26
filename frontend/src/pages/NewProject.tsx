import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface VesselType {
  vessel_type_id: string;
  type_name: string;
}

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [token, setToken] = useState<string | null>(null);
  const [vesselTypes, setVesselTypes] = useState<VesselType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Date States
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // Errors State
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState({
    // Step 1: Vessel
    vesselTypeId: "", 
    loa: "",
    beam: "",
    draft: "",
    depth: "",
    displacement: "",
    designSpeed: "",
    navigationArea: "SEA",
    classSociety: "",
    versionNumber: "1.0",

    // Step 2: Project
    projectName: "",
    projectCode: "",
    projectType: "",
    clientName: "",
    shipyardName: "",
  });

  // Fetch Logic
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchVesselTypes(storedToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchVesselTypes = async (authToken: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/vessels/types", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVesselTypes(data.vessel_types);
      }
    } catch (error) {
      console.error("Error fetching types");
    }
  };

  // --- VALIDATION ---
  const validateStep1 = () => {
    const fields = ["vesselTypeId", "loa", "beam", "draft", "depth", "displacement", "designSpeed", "classSociety"];
    let hasError = false;
    let newErrors = { ...errors };

    fields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
            newErrors[field] = "This field is required";
            hasError = true;
        }
    });
    setErrors(newErrors);
    return !hasError;
  };

  const validateStep2 = () => {
    const fields = ["projectName", "projectCode", "projectType", "clientName", "shipyardName"];
    let hasError = false;
    let newErrors = { ...errors };

    fields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
            newErrors[field] = "This field is required";
            hasError = true;
        }
    });
    
    if (!targetDate) {
        // Optional: you can make target date mandatory or optional here
        // newErrors["targetDate"] = "Required"; 
        // hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on type
    if (errors[e.target.name]) {
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // --- NAVIGATION ---
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
        setStep(2);
    }
  };

  // --- FINAL SUBMIT (ATOMIC TRANSACTION LOGIC) ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      // 1. Create Vessel First
      const vesselResponse = await fetch("http://127.0.0.1:5000/api/vessels/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            vesselTypeId: formData.vesselTypeId,
            loa: parseFloat(formData.loa),
            beam: parseFloat(formData.beam),
            draft: parseFloat(formData.draft),
            depth: parseFloat(formData.depth),
            displacement: parseFloat(formData.displacement),
            designSpeed: parseFloat(formData.designSpeed),
            navigationArea: formData.navigationArea,
            classSociety: formData.classSociety,
            versionNumber: formData.versionNumber
        })
      });

      if (!vesselResponse.ok) {
        const err = await vesselResponse.json();
        throw new Error(err.error || "Vessel creation failed");
      }

      const vesselData = await vesselResponse.json();
      const newVesselId = vesselData.vessel_id; // Got the ID!

      // 2. Create Project using the new Vessel ID
      const projectResponse = await fetch("http://127.0.0.1:5000/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            vesselId: newVesselId, // LINKING HERE
            projectCode: formData.projectCode,
            projectName: formData.projectName,
            projectType: formData.projectType,
            clientName: formData.clientName,
            shipyardName: formData.shipyardName,
            projectStatus: "Active",
            targetDeliveryDate: targetDate ? targetDate.toISOString().split('T')[0] : null
        })
      });

      if (!projectResponse.ok) {
        const err = await projectResponse.json();
        throw new Error(err.error || "Project creation failed");
      }

      // Success!
      alert("Project Created Successfully 🚢");
      navigate("/projects");

    } catch (error: any) {
      console.error(error);
      alert(`Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-sm min-h-screen font-sans">
      <div className="px-10 py-8">
        
        {/* STEPPER */}
        <div className="flex items-center mb-14 max-w-4xl mx-auto">
          {["Vessel Info", "Project Info"].map((label, index) => {
            const currentStep = index + 1;
            return (
              <div key={index} className="flex items-center flex-1">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all ${step >= currentStep ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                  {currentStep}
                </div>
                <span className="ml-3 font-medium text-gray-700">{label}</span>
                {index < 1 && <div className={`flex-1 h-1 mx-6 transition-all ${step > currentStep ? "bg-blue-600" : "bg-gray-300"}`} />}
              </div>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto">
            
            {/* STEP 1: VESSEL INFO (Just Next Button) */}
            {step === 1 && (
            <form onSubmit={handleNext} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                
                <div className="md:col-span-3">
                    <label className="label">Vessel Type <span className="text-red-500">*</span></label>
                    <select name="vesselTypeId" value={formData.vesselTypeId} onChange={handleChange} className={`input ${errors.vesselTypeId ? 'border-red-500' : ''}`} required>
                        <option value="">Select Vessel Type</option>
                        {vesselTypes.map((type) => (
                            <option key={type.vessel_type_id} value={type.vessel_type_id}>{type.type_name}</option>
                        ))}
                    </select>
                    {errors.vesselTypeId && <p className="text-red-500 text-xs mt-1">{errors.vesselTypeId}</p>}
                </div>

                {[
                    { label: "LOA (m)", name: "loa" },
                    { label: "Beam (m)", name: "beam" },
                    { label: "Draft (m)", name: "draft" },
                    { label: "Depth (m)", name: "depth" },
                    { label: "Displacement (t)", name: "displacement" },
                    { label: "Design Speed (kn)", name: "designSpeed" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="label">{field.label} <span className="text-red-500">*</span></label>
                        <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className={`input ${errors[field.name] ? 'border-red-500' : ''}`} required min="0" step="0.01" />
                        {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                    </div>
                ))}
                
                <div>
                    <label className="label">Navigation Area <span className="text-red-500">*</span></label>
                    <select name="navigationArea" value={formData.navigationArea} onChange={handleChange} className="input" required>
                        <option value="SEA">Sea</option>
                        <option value="COASTAL">Coastal</option>
                        <option value="RIVER">River</option>
                    </select>
                </div>

                <div>
                    <label className="label">Class Society <span className="text-red-500">*</span></label>
                    <input name="classSociety" value={formData.classSociety} onChange={handleChange} className={`input ${errors.classSociety ? 'border-red-500' : ''}`} required />
                    {errors.classSociety && <p className="text-red-500 text-xs mt-1">{errors.classSociety}</p>}
                </div>

                <div><label className="label">Version Number</label><input name="versionNumber" value={formData.versionNumber} className="input bg-gray-100" disabled /></div>

                <div className="col-span-full flex gap-6 mt-10 border-t pt-8">
                    <button type="button" onClick={() => navigate("/projects")} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Next Step</button>
                </div>
            </form>
            )}

            {/* STEP 2: PROJECT INFO (Final Submit) */}
            {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                
                {[
                    { label: "Project Name", name: "projectName" },
                    { label: "Project Code", name: "projectCode" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="label">{field.label} <span className="text-red-500">*</span></label>
                        <input name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className={`input ${errors[field.name] ? 'border-red-500' : ''}`} required />
                        {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                    </div>
                ))}
                
                <div className="md:col-span-2">
                    <label className="label">Project Type <span className="text-red-500">*</span></label>
                    <select name="projectType" value={formData.projectType} onChange={handleChange} className={`input ${errors.projectType ? 'border-red-500' : ''}`} required>
                        <option value="">Select Type</option>
                        <option value="New Build">New Build</option>
                        <option value="Retrofit">Retrofit</option>
                        <option value="Conversion">Conversion</option>
                    </select>
                    {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}
                </div>

                {[
                    { label: "Client Name", name: "clientName" },
                    { label: "Shipyard Name", name: "shipyardName" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="label">{field.label} <span className="text-red-500">*</span></label>
                        <input name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className={`input ${errors[field.name] ? 'border-red-500' : ''}`} required />
                        {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                    </div>
                ))}

                <div className="md:col-span-2 grid grid-cols-2 gap-12">
                    <div>
                        <label className="label">Start Date</label>
                        <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="input w-full bg-gray-100 cursor-not-allowed" disabled />
                    </div>
                    <div>
                        <label className="label">Target Delivery Date <span className="text-red-500">*</span></label>
                        <DatePicker selected={targetDate} onChange={(date: Date | null) => setTargetDate(date)} dateFormat="dd/MM/yyyy" className="input w-full" placeholderText="Select Date" required />
                    </div>
                </div>

                <div className="col-span-full flex gap-6 mt-6 border-t pt-8">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary" disabled={isSubmitting}>Back</button>
                    
                    <button 
                        type="submit" 
                        className={`btn-primary bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default NewProject;