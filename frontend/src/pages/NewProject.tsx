import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [targetDate, setTargetDate] = useState<Date | null>(null);


  const [formData, setFormData] = useState<any>({
    // STEP 1
    projectName: "",
    projectCode: "",
    vesselType: "",
    projectType: "",
    clientName: "",
    shipyardName: "",

    // STEP 2 (GA)
    vesselId: "",
    loa: "",
    beam: "",
    draft: "",
    depth: "",
    displacement: "",
    designSpeed: "",
    navigationArea: "",
    classSociety: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded: any = jwtDecode(token);
    console.log("Decoded JWT:", decoded); // 👈 ADD THIS

    setFormData((prev: any) => ({
      ...prev,
      createdBy: decoded?.role_name || decoded?.username || "",
    }));
  }
}, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verification: Ensure basic fields are present
    if (!formData.projectName || !formData.projectCode) {
      alert("Please fill in Project Name and Code.");
      return;
    }

    // Create the final project object
    const newProjectEntry = {
      ...formData,
      // This ID is crucial! It is what /projects/:projectId/parameters uses
      id: Date.now().toString(), 
      projectStatus: "Active", // Added default status for the card UI
      startDate: startDate ? startDate.toISOString() : null,
      targetDate: targetDate ? targetDate.toISOString() : null,
      createdAt: new Date().toISOString(),
    };

    // 1. Get existing projects from localStorage
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");

    // 2. Add the new project to the array
    const updatedProjects = [...existingProjects, newProjectEntry];

    // 3. Save back to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    alert("Project Created Successfully 🚢");
    
    // Redirect back to the projects dashboard
    navigate("/projects");
  };

  return (
    <div className="w-full bg-white shadow-sm min-h-screen">
      <div className="px-10 py-8">
        {/* STEPPER */}
        <div className="flex items-center mb-14 max-w-4xl mx-auto">
          {["Project Info", "Vessel Info"].map((label, index) => {
            const currentStep = index + 1;
            return (
              <div key={index} className="flex items-center flex-1">
                {/* Circle */}
                <div
                  onClick={() => setStep(currentStep)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer transition-all duration-300
                  ${
                    step >= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {currentStep}
                </div>

                {/* Label */}
                <span
                  onClick={() => setStep(currentStep)}
                  className="ml-3 font-medium text-gray-700 cursor-pointer select-none"
                >
                  {label}
                </span>

                {/* Line */}
                {index < 1 && (
                  <div
                    className={`flex-1 h-1 mx-6 transition-all duration-300
                    ${step > currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto">
            {/* ================= STEP 1: Project Info ================= */}
            {step === 1 && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                <label className="label">Project Name *</label>
                <input name="projectName" value={formData.projectName} onChange={handleChange} className="input" placeholder="e.g. MV Apollo" />
                </div>

                <div>
                <label className="label">Project Code *</label>
                <input name="projectCode" value={formData.projectCode} onChange={handleChange} className="input" placeholder="e.g. P-2024-01" />
                </div>

                <div>
                <label className="label">Vessel Type *</label>
                <select name="vesselType" value={formData.vesselType} onChange={handleChange} className="input">
                    <option value="">Select Vessel Type</option>
                    <option>Harbor and ASD Tugs</option>
                    <option>River Vessel</option>
                    <option>Coastal Vessel</option>
                    <option>Barges</option>
                    <option>Offshore support vessels</option>
                    <option>Passenger ferries</option>
                    <option>Petrol / utility / government vessels</option>
                    <option>Fishing vessels</option>
                    <option>Special purpose and custom vessels</option>
                </select>
                </div>

                <div>
                <label className="label">Project Type *</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} className="input">
                    <option value="">Select Type</option>
                    <option>New Build</option>
                    <option>Retrofit</option>
                    <option>Conversion</option>
                </select>
                </div>

                <div>
                <label className="label">Client Name</label>
                <input name="clientName" value={formData.clientName} onChange={handleChange} className="input" />
                </div>

                <div>
                <label className="label">Shipyard Name</label>
                <input name="shipyardName" value={formData.shipyardName} onChange={handleChange} className="input" />
                </div>

                <div>
                <label className="label">Start Date & Time *</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="input w-full"
                />
                </div>

                <div>
                <label className="label">Target Date & Time</label>
                <DatePicker
                    selected={targetDate}
                    onChange={(date) => setTargetDate(date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="input w-full"
                />
                </div>

                <div className="col-span-full flex gap-6 mt-6 border-t pt-8">
                <button type="button" onClick={() => navigate("/projects")} className="px-8 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-all">
                    Cancel
                </button>
                <button type="button" onClick={nextStep} className="px-10 py-2.5 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-md transition-all">
                    Next Step
                </button>
                </div>
            </form>
            )}

            {/* ================= STEP 2: Vessel Info ================= */}
            {step === 2 && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div><label className="label">Vessel ID</label><input name="vesselId" value={formData.vesselId} onChange={handleChange} className="input"/></div>
                <div><label className="label">LOA (m)</label><input name="loa" value={formData.loa} onChange={handleChange} className="input"/></div>
                <div><label className="label">Beam (m)</label><input name="beam" value={formData.beam} onChange={handleChange} className="input"/></div>
                <div><label className="label">Draft (m)</label><input name="draft" value={formData.draft} onChange={handleChange} className="input"/></div>
                <div><label className="label">Depth (m)</label><input name="depth" value={formData.depth} onChange={handleChange} className="input"/></div>
                <div><label className="label">Displacement</label><input name="displacement" value={formData.displacement} onChange={handleChange} className="input"/></div>
                <div><label className="label">Design Speed</label><input name="designSpeed" value={formData.designSpeed} onChange={handleChange} className="input"/></div>
                <div><label className="label">Navigation Area</label><input name="navigationArea" value={formData.navigationArea} onChange={handleChange} className="input"/></div>
                <div><label className="label">Class Society</label><input name="classSociety" value={formData.classSociety} onChange={handleChange} className="input"/></div>

                <div className="col-span-full flex gap-6 mt-10 border-t pt-8">
                <button type="button" onClick={prevStep} className="px-8 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-all">
                    Back
                </button>
                <button type="submit" className="px-10 py-2.5 rounded-lg bg-green-600 font-bold text-white hover:bg-green-700 shadow-md transition-all">
                    Create Project 🚢
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