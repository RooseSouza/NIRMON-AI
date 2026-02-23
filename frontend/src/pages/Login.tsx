import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shipImage from "../assets/ship.jpg";
import logo from "../assets/nirmon-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Login Logic
    setTimeout(() => {
      localStorage.setItem("userRole", "user");
      navigate("/dashboard");
    }, 1000);
  };

  const handleViewerLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("userRole", "viewer");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* LEFT SIDE - FORM */}
      <div className="flex flex-col justify-center w-full max-w-xl px-8 mx-auto lg:px-12 xl:w-1/2">
        
        {/* Logo */}
        <div className="mb-10">
          <img src={logo} alt="Nirmon Logo" className="h-12 w-auto object-contain" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">
            Enter your email and password to sign in.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  // Eye Icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // Eye Slash Icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex justify-center items-center gap-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={handleViewerLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Continue as Viewer
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nirmon Marine Design. All rights reserved.
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10"></div>
        <img
          src={shipImage}
          alt="Ship Design"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Optional Overlay Text on Image */}
        <div className="absolute bottom-12 left-12 z-20 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Engineering the Future of Maritime
          </h2>
          <p className="text-lg opacity-90 drop-shadow-md">
            Advanced AI-driven solutions for ship design and compliance automation.
          </p>
        </div>
      </div>

    </div>
  );
}   