import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shipImage from "../assets/ship.jpg";
import logo from "../assets/nirmon-logo.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New Loading State
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Start Loading
    setIsLoading(true);

    // Simulate Network Request (1 Second Delay)
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center font-sans"
      style={{ backgroundImage: `url(${shipImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-white rounded-2xl px-3 py-2 shadow-xl">
          <img src={logo} alt="Nirmon Logo" className="h-14 object-contain" />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-[540px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 text-white">
        {/* Title */}
        <h2 className="text-5xl font-bold tracking-wide text-left text-white">
          LOGIN
        </h2>

        <p className="text-left text-sm text-gray-200 mt-2 mb-12 tracking-wide font-medium">
          TO START WORKING ON YOUR PROJECT
        </p>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 tracking-wide">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 transition shadow-inner font-normal disabled:opacity-70"
              required
            />
          </div>

          {/* USER ID */}
          <div className="mb-10">
            <label className="block text-sm font-bold mb-2 tracking-wide">
              USER ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 transition shadow-inner font-normal disabled:opacity-70"
              required
            />
          </div>

          {/* Login Button with Loading State */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-lg font-bold tracking-wide shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                isLoading ? "cursor-not-allowed opacity-80 scale-95" : "hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  {/* Spinner SVG */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;