import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Save, Layout, Loader2 } from "lucide-react";

const InputParameter: React.FC = () => {
  const { projectId } = useParams(); // This gets the ID from the URL bar
  const navigate = useNavigate();
  
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 DATABASE LOGIC: Fetch specific project details from API
  useEffect(() => {
    console.log("🛠️ InputParameter Mounted. Project ID:", projectId);

    const fetchProjectDetails = async () => {
      const token = localStorage.getItem("token");

      console.log("🔄 Fetching details for project:", projectId);

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Project Details Loaded:", data);
          setProjectDetails(data.project);
        } else {
          console.error("❌ Failed to fetch project. Status:", response.status);
        }
      } catch (error) {
        console.error("❌ API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectDetails();
  }, [projectId, navigate]);

  const [decks, setDecks] = useState<any[]>([
    {
      deckSequence: 1,
      deckName: "",
      deckCode: "",
      deckElevationZ: "",
      deckType: "Main Deck",
      isWatertight: false,
      isFreeboardDeck: false,
      createdAt: new Date().toLocaleString(),
    },
  ]);

  const handleInputChange = (index: number, e: any) => {
    const { name, value, type, checked } = e.target;
    const updatedDecks = [...decks];
    updatedDecks[index][name] = type === "checkbox" ? checked : value;
    updatedDecks[index].modifiedAt = new Date().toLocaleString();
    setDecks(updatedDecks);
  };

  const addDeck = () => {
    setDecks([
      ...decks,
      {
        deckSequence: decks.length + 1,
        deckName: "",
        deckCode: "",
        deckElevationZ: "",
        deckType: "Accommodation Deck",
        isWatertight: false,
        isFreeboardDeck: false,
        createdAt: new Date().toLocaleString(),
      },
    ]);
  };

  const removeDeck = (index: number) => {
    if (decks.length > 1) {
      setDecks(decks.filter((_, i) => i !== index));
    }
  };

  // Show a loader while the database is fetching the ship name
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest">Loading Vessel Parameters...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col px-8 py-8 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/projects")} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase">Input Parameters</h1>
            <p className="text-blue-600 text-sm mt-1 font-bold uppercase tracking-widest italic">
              Nirmon AI Project: {projectDetails?.project_name || "Unknown Project"} ({projectDetails?.project_code || "---"})
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={addDeck} className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-[#465FFF] text-[#465FFF] rounded-lg font-bold hover:bg-blue-50 transition-all">
            <Plus size={18} /> ADD MORE DECK
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#465FFF] text-white rounded-lg font-bold shadow-lg hover:bg-[#3548F5] transition-all">
            <Save size={18} /> SAVE PARAMETERS
          </button>
        </div>
      </div>

      {/* ================= DECK CARDS ================== */}
      <div className="flex flex-col gap-8">
        {decks.map((deck, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="bg-gray-800 px-6 py-3 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Layout size={18} className="text-blue-400" />
                <span className="font-bold tracking-widest text-sm uppercase">Deck Sequence #{deck.deckSequence}</span>
              </div>
              {decks.length > 1 && (
                <button onClick={() => removeDeck(index)} className="text-red-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deck Name</label>
                <input name="deckName" onChange={(e) => handleInputChange(index, e)} className="border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Upper Deck" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deck Code</label>
                <input name="deckCode" onChange={(e) => handleInputChange(index, e)} className="border rounded-lg p-2.5 text-sm outline-none" placeholder="e.g. DK01" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Elevation (Z)</label>
                <input name="deckElevationZ" onChange={(e) => handleInputChange(index, e)} className="border rounded-lg p-2.5 text-sm outline-none" placeholder="0.000 m" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deck Type</label>
                <select name="deckType" onChange={(e) => handleInputChange(index, e)} className="border rounded-lg p-2.5 text-sm outline-none bg-white font-semibold">
                  <option>Main Deck</option>
                  <option>Lower Deck</option>
                  <option>Tank Top</option>
                  <option>Accommodation Deck</option>
                </select>
              </div>

              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="isWatertight" onChange={(e) => handleInputChange(index, e)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">Watertight</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="isFreeboardDeck" onChange={(e) => handleInputChange(index, e)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">Freeboard</span>
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plate Thickness</label>
                <input name="deckPlateThickness" onChange={(e) => handleInputChange(index, e)} className="border rounded-lg p-2.5 text-sm outline-none" placeholder="mm" />
              </div>
            </div>
            
            <div className="px-8 py-2 bg-gray-50 border-t text-[10px] font-mono text-gray-400 flex gap-4 uppercase">
              <span>Created: {deck.createdAt}</span>
              {deck.modifiedAt && <span>Modified: {deck.modifiedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
);
};
export default InputParameter;