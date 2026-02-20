import React, { useState } from "react";
import shipImage from "../assets/ship.jpg";
import logo from "../assets/nirmon-logo.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ username, userId });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center font-genos"
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
        {/* Title - LEFT ALIGNED */}
        <h2 className="text-5xl font-semibold tracking-widest text-left">
          LOGIN
        </h2>

        <p className="text-left text-sm text-gray-200 mt-2 mb-12 tracking-wider">
          TO START WORKING ON YOUR PROJECT
        </p>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 tracking-wider">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-3 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* USER ID */}
          <div className="mb-10">
            <label className="block text-sm font-semibold mb-2 tracking-wider">
              USER ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-6 py-3 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 text-lg font-semibold shadow-lg"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
