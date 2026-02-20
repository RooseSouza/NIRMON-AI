import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shipImage from "../assets/ship.jpg";
import logo from "../assets/nirmon-logo.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // Error state for email
  const navigate = useNavigate();

  // Simple Email Validation Regex
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation Check
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    handleAuth("login");
  };

  const handleViewerLogin = () => {
    handleAuth("viewer");
  };

  const handleAuth = (type: "login" | "viewer") => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(type === "login" ? "User logged in" : "Viewer access granted");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center font-sans"
      style={{ backgroundImage: `url(${shipImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="absolute top-6 left-6 z-20">
        <div className="bg-white rounded-2xl px-3 py-2 shadow-xl">
          <img src={logo} alt="Nirmon Logo" className="h-14 object-contain" />
        </div>
      </div>

      <div className="relative z-10 w-[540px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 text-white">
        <h2 className="text-5xl font-bold tracking-wide text-left text-white">
          LOGIN
        </h2>

        <p className="text-left text-sm text-gray-200 mt-2 mb-12 tracking-wide font-medium">
          TO START WORKING ON YOUR PROJECT
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* EMAIL INPUT */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(""); // Clear error on typing
              }}
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 transition shadow-inner font-normal disabled:opacity-70 ${
                emailError 
                  ? "border-2 border-red-500 focus:ring-red-500" 
                  : "focus:ring-cyan-400"
              }`}
              placeholder="name@company.com"
              required={!isLoading}
            />
            {/* Validation Message */}
            {emailError && (
              <p className="text-red-400 text-xs mt-2 ml-4 font-medium tracking-wide">
                {emailError}
              </p>
            )}
          </div>

          {/* PASSWORD INPUT */}
          <div className="mb-10 relative">
            <label className="block text-sm font-bold mb-2 tracking-wide">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-full bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 transition shadow-inner font-normal disabled:opacity-70 pr-12"
                required={!isLoading}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-600 transition focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Buttons Area */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-lg font-bold tracking-wide shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                isLoading ? "cursor-not-allowed opacity-80 scale-95" : "hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Login"
              )}
            </button>

            {!isLoading && (
              <button
                type="button"
                onClick={handleViewerLogin}
                className="text-sm text-gray-300 hover:text-white underline underline-offset-4 decoration-gray-500 hover:decoration-white transition-all font-medium tracking-wide"
              >
                Continue as Viewer
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;