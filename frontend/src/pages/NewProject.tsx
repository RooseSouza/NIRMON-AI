import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<any>({
    // STEP 1
    projectName: "",
    projectCode: "",
    vesselType: "",
    projectType: "",
    clientName: "",
    shipyardName: "",
    projectStatus: "Active",
    createdBy: "Admin",

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

    // STEP 3 (Version & Regulatory)
    projectId: "",
    versionNumber: "1.0",
    versionStatus: "",
    currentVersion: "",
    regulatoryFramework: "",
    classNotation: "",
    shipType: "",
    grossTonnage: "",
    deadweight: "",
    crewCount: "",
    officerCount: "",
    ratingCount: "",
    passengerCount: "",
    enduranceDays: "",
    voyageDurationDays: "",
    umsNotation: "",
    createdAt: "",
    modifiedBy: "",
    modifiedAt: "",
    submittedAt: "",
    submittedBy: "",
    approvedBy: "",
    approvedAt: "",
    notes: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Final Data:", {
      ...formData,
      startDate,
      targetDate,
    });
    alert("Project Created Successfully 🚢");
    navigate("/projects");
  };

  return (
   
      <div className="w-full bg-white shadow-sm">
  <div className="px-10 py-8">

        {/* STEPPER */}
<div className="flex items-center mb-14">
  {["Project Info", "GA Parameters", "Version & Regulatory"].map(
    (label, index) => {
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
          {index < 2 && (
            <div
              className={`flex-1 h-1 mx-6 transition-all duration-300
              ${
                step > currentStep
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            />
          )}
        </div>
      );
    }
  )}
</div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form className="grid grid-cols-2 gap-10">

            <div>
              <label className="label">Project Name *</label>
              <input name="projectName" onChange={handleChange} className="input"/>
            </div>

            <div>
              <label className="label">Project Code *</label>
              <input name="projectCode" onChange={handleChange} className="input"/>
            </div>

            <div>
              <label className="label">Vessel Type *</label>
              <select name="vesselType" onChange={handleChange} className="input">
                <option>Select Vessel Type</option>
                <option>Harbor and ASD Tugs</option>
                <option>River Vessel</option>
                <option>Coastal Vessel</option>
                <option>Barges</option>
                <option> Offshore support vessels</option>
                <option>Passenger ferries</option>
                <option>Petrol / utility / government vessels</option>
                <option>Barges</option>
                <option>Fishing vessels</option>
                <option>Special purpose and custom vessels</option>
              </select>
            </div>

            <div>
              <label className="label">Project Type *</label>
              <select name="projectType" onChange={handleChange} className="input">
                <option>Select Type</option>
                <option>New Build</option>
                <option>Retrofit</option>
                <option>Conversion</option>
              </select>
            </div>

            <div>
              <label className="label">Client Name</label>
              <input name="clientName" onChange={handleChange} className="input"/>
            </div>

            <div>
              <label className="label">Shipyard Name</label>
              <input name="shipyardName" onChange={handleChange} className="input"/>
            </div>

            <div>
              <label className="label">Start Date & Time *</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                className="input"
              />
            </div>

            <div>
              <label className="label">Target Date & Time</label>
              <DatePicker
                selected={targetDate}
                onChange={(date) => setTargetDate(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                className="input"
              />
            </div>

            <div>
              <label className="label">Project Status</label>
              <select name="projectStatus" onChange={handleChange} className="input">
                <option>Active</option>
                <option>Draft</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Completed</option>
              </select>
            </div>

            <div>
              <label className="label">Created By</label>
              <input value={formData.createdBy} readOnly className="input bg-gray-100"/>
            </div>

            <div className="col-span-2 flex gap-6 mt-6">
               <button type="button" onClick={() => navigate("/projects")} className="btn-secondary">Cancel</button>

               
              <button type="button" onClick={nextStep} className="btn-primary">Next</button>
             
            </div>

          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <form className="grid grid-cols-2 gap-10">

            <div><label className="label">Vessel ID</label><input name="vesselId" onChange={handleChange} className="input"/></div>
            <div><label className="label">LOA (m)</label><input name="loa" onChange={handleChange} className="input"/></div>
            <div><label className="label">Beam (m)</label><input name="beam" onChange={handleChange} className="input"/></div>
            <div><label className="label">Draft (m)</label><input name="draft" onChange={handleChange} className="input"/></div>
            <div><label className="label">Depth (m)</label><input name="depth" onChange={handleChange} className="input"/></div>
            <div><label className="label">Displacement</label><input name="displacement" onChange={handleChange} className="input"/></div>
            <div><label className="label">Design Speed</label><input name="designSpeed" onChange={handleChange} className="input"/></div>
            <div><label className="label">Navigation Area</label><input name="navigationArea" onChange={handleChange} className="input"/></div>
            <div><label className="label">Class Society</label><input name="classSociety" onChange={handleChange} className="input"/></div>

            <div className="col-span-2 flex gap-6 mt-6">
              <button type="button" onClick={prevStep} className="btn-secondary">Back</button>
              <button type="button" onClick={nextStep} className="btn-primary">Next</button>
            </div>

          </form>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-10">

            <div><label className="label">Project ID</label><input name="projectId" onChange={handleChange} className="input"/></div>
           
      
           
            <div><label className="label">Regulatory Framework</label><input name="regulatoryFramework" onChange={handleChange} className="input"/></div>
            <div><label className="label">Class Notation</label><input name="classNotation" onChange={handleChange} className="input"/></div>
            <div><label className="label">Ship Type</label><input name="shipType" onChange={handleChange} className="input"/></div>
            <div><label className="label">Gross Tonnage</label><input name="grossTonnage" onChange={handleChange} className="input"/></div>
            <div><label className="label">Deadweight</label><input name="deadweight" onChange={handleChange} className="input"/></div>
            <div><label className="label">Crew Count</label><input name="crewCount" onChange={handleChange} className="input"/></div>
            <div><label className="label">Officer Count</label><input name="officerCount" onChange={handleChange} className="input"/></div>
            <div><label className="label">Rating Count</label><input name="ratingCount" onChange={handleChange} className="input"/></div>
            <div><label className="label">Passenger Count</label><input name="passengerCount" onChange={handleChange} className="input"/></div>
            <div><label className="label">Endurance Days</label><input name="enduranceDays" onChange={handleChange} className="input"/></div>
            <div><label className="label">Voyage Duration Days</label><input name="voyageDurationDays" onChange={handleChange} className="input"/></div>
            <div><label className="label">UMS Notation</label><input name="umsNotation" onChange={handleChange} className="input"/></div>
            <div><label className="label">Created At</label><input name="createdAt" onChange={handleChange} className="input"/></div>
            <div><label className="label">Modified By</label><input name="modifiedBy" onChange={handleChange} className="input"/></div>
            <div><label className="label">Modified At</label><input name="modifiedAt" onChange={handleChange} className="input"/></div>
            <div><label className="label">Submitted At</label><input name="submittedAt" onChange={handleChange} className="input"/></div>
            <div><label className="label">Submitted By</label><input name="submittedBy" onChange={handleChange} className="input"/></div>
            <div><label className="label">Approved By</label><input name="approvedBy" onChange={handleChange} className="input"/></div>
            <div><label className="label">Approved At</label><input name="approvedAt" onChange={handleChange} className="input"/></div>

            <div className="col-span-2">
              <label className="label">Notes</label>
              <textarea name="notes" onChange={handleChange} className="input h-28"/>
            </div>

            <div className="col-span-2 flex gap-6 mt-6">
              <button type="button" onClick={prevStep} className="btn-secondary">Back</button>
              <button type="submit" className="btn-primary">Create Project</button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default NewProject;