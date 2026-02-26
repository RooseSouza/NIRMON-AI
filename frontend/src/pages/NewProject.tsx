import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

<<<<<<< HEAD
// Interface for Vessel Type
=======
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
interface VesselType {
  vessel_type_id: string;
  type_name: string;
}

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [token, setToken] = useState<string | null>(null);
<<<<<<< HEAD
  
  // Data States
  const [vesselTypes, setVesselTypes] = useState<VesselType[]>([]);
  const [createdVesselId, setCreatedVesselId] = useState<string | null>(null);

=======
  const [vesselTypes, setVesselTypes] = useState<VesselType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
  // Date States
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [targetDate, setTargetDate] = useState<Date | null>(null);

<<<<<<< HEAD
=======
  // Errors State
  const [errors, setErrors] = useState<{[key: string]: string}>({});

>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
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

<<<<<<< HEAD
  // 1. Get Token & Fetch Vessel Types on Mount
=======
  // Fetch Logic
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
<<<<<<< HEAD
      fetchVesselTypes(storedToken); // Fetch types immediately
    } else {
      alert("You must be logged in.");
=======
      fetchVesselTypes(storedToken);
    } else {
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
      navigate("/");
    }
  }, [navigate]);

<<<<<<< HEAD
  // 2. Fetch Function
  const fetchVesselTypes = async (authToken: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/vessels/types", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVesselTypes(data.vessel_types); // Assuming backend returns { "vessel_types": [...] }
      } else {
        console.error("Failed to fetch vessel types");
      }
    } catch (error) {
      console.error("Error fetching vessel types:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 1: VESSEL SUBMIT ---
    const handleVesselSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = createdVesselId 
      ? `http://127.0.0.1:5000/api/vessels/${createdVesselId}` // Update URL
      : "http://127.0.0.1:5000/api/vessels/";                 // Create URL

    const method = createdVesselId ? "PUT" : "POST"; // Switch Method

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            vesselTypeId: formData.vesselTypeId,
            loa: parseFloat(formData.loa),
            beam: parseFloat(formData.beam),
            draft: parseFloat(formData.draft),
            depth: formData.depth ? parseFloat(formData.depth) : null,
            displacement: formData.displacement ? parseFloat(formData.displacement) : null,
            designSpeed: formData.designSpeed ? parseFloat(formData.designSpeed) : null,
            navigationArea: formData.navigationArea,
            classSociety: formData.classSociety,
            versionNumber: formData.versionNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (!createdVesselId) {
            setCreatedVesselId(data.vessel_id); // Save ID only on first create
        }
        setStep(2); // Move to next step
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Server Error");
=======
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
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
    }
  };

<<<<<<< HEAD
  // --- STEP 2: PROJECT SUBMIT ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdVesselId) return alert("Vessel ID missing.");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            vesselId: createdVesselId,
            projectCode: formData.projectCode,
            projectName: formData.projectName,
            projectType: formData.projectType,
            clientName: formData.clientName,
            shipyardName: formData.shipyardName,
            projectStatus: "Active",
            targetDeliveryDate: targetDate ? targetDate.toISOString().split('T')[0] : null
        })
      });

      if (response.ok) {
        alert("Project Created Successfully 🚢");
        navigate("/projects");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Server Error");
=======
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
            projectStatus: "Under Review",
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
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
    }
  };

  return (
    <div className="w-full bg-white shadow-sm min-h-screen font-sans">
      <div className="px-10 py-8">
        
<<<<<<< HEAD
        {/* STEPPER UI */}
=======
        {/* STEPPER */}
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
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
            
<<<<<<< HEAD
            {/* STEP 1 FORM */}
            {step === 1 && (
            <form onSubmit={handleVesselSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                
                {/* DYNAMIC DROPDOWN */}
                <div className="md:col-span-3">
                    <label className="label">Vessel Type *</label>
                    <select 
                        name="vesselTypeId" 
                        value={formData.vesselTypeId} 
                        onChange={handleChange} 
                        className="input" 
                        required
                    >
                        <option value="">Select Vessel Type</option>
                        {vesselTypes.map((type) => (
                            <option key={type.vessel_type_id} value={type.vessel_type_id}>
                                {type.type_name}
                            </option>
                        ))}
                    </select>
=======
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
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
                </div>

                <div><label className="label">LOA (m) *</label><input type="number" name="loa" value={formData.loa} onChange={handleChange} className="input" required /></div>
                <div><label className="label">Beam (m) *</label><input type="number" name="beam" value={formData.beam} onChange={handleChange} className="input" required /></div>
                <div><label className="label">Draft (m) *</label><input type="number" name="draft" value={formData.draft} onChange={handleChange} className="input" required /></div>
                <div><label className="label">Depth (m)</label><input type="number" name="depth" value={formData.depth} onChange={handleChange} className="input"/></div>
                <div><label className="label">Displacement (t)</label><input type="number" name="displacement" value={formData.displacement} onChange={handleChange} className="input"/></div>
                <div><label className="label">Design Speed (kn)</label><input type="number" name="designSpeed" value={formData.designSpeed} onChange={handleChange} className="input"/></div>
                
                <div>
<<<<<<< HEAD
                    <label className="label">Navigation Area *</label>
                    <select name="navigationArea" value={formData.navigationArea} onChange={handleChange} className="input">
                        <option value="SEA">Sea</option>
                        <option value="COASTAL">Coastal</option>
                        <option value="RIVER">River</option>
                    </select>
                </div>

                <div><label className="label">Class Society *</label><input name="classSociety" value={formData.classSociety} onChange={handleChange} className="input" required /></div>
=======
                    <label className="label">Class Society <span className="text-red-500">*</span></label>
                    <input name="classSociety" value={formData.classSociety} onChange={handleChange} className={`input ${errors.classSociety ? 'border-red-500' : ''}`} required />
                    {errors.classSociety && <p className="text-red-500 text-xs mt-1">{errors.classSociety}</p>}
                </div>

>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
                <div><label className="label">Version Number</label><input name="versionNumber" value={formData.versionNumber} className="input bg-gray-100" disabled /></div>

                <div className="col-span-full flex gap-6 mt-10 border-t pt-8">
                    <button type="button" onClick={() => navigate("/projects")} className="btn-secondary">Cancel</button>
<<<<<<< HEAD
                    <button type="submit" className="btn-primary">Save Vessel & Next</button>
=======
                    <button type="submit" className="btn-primary">Next Step</button>
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
                </div>
            </form>
            )}

<<<<<<< HEAD
            {/* STEP 2 FORM (Project) */}
            {step === 2 && (
            <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div><label className="label">Project Name *</label><input name="projectName" value={formData.projectName} onChange={handleChange} className="input" required /></div>
                <div><label className="label">Project Code *</label><input name="projectCode" value={formData.projectCode} onChange={handleChange} className="input" required /></div>
                
                <div>
                    <label className="label">Project Type *</label>
                    <select name="projectType" value={formData.projectType} onChange={handleChange} className="input" required>
=======
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
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
                        <option value="">Select Type</option>
                        <option value="New Build">New Build</option>
                        <option value="Retrofit">Retrofit</option>
                        <option value="Conversion">Conversion</option>
                    </select>
<<<<<<< HEAD
                </div>

                <div><label className="label">Client Name</label><input name="clientName" value={formData.clientName} onChange={handleChange} className="input" /></div>
                <div><label className="label">Shipyard Name</label><input name="shipyardName" value={formData.shipyardName} onChange={handleChange} className="input" /></div>
                <div><label className="label">Start Date</label><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="input w-full" disabled /></div>
                <div><label className="label">Target Delivery Date</label><DatePicker selected={targetDate} onChange={(date) => setTargetDate(date)} dateFormat="dd/MM/yyyy" className="input w-full" placeholderText="Select Date" /></div>

                <div className="col-span-full flex gap-6 mt-6 border-t pt-8">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
                    <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700">Create Project</button>
=======
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
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="input w-full bg-gray-100 cursor-not-allowed" disabled />
                    </div>
                    <div>
                        <label className="label">Target Delivery Date <span className="text-red-500">*</span></label>
                        <DatePicker selected={targetDate} onChange={(date) => setTargetDate(date)} dateFormat="dd/MM/yyyy" className="input w-full" placeholderText="Select Date" required />
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
>>>>>>> 8afcb077527709ad37950de07087090fe98c6817
                </div>
            </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default NewProject;