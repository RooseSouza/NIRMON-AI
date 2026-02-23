import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shipImage from "../assets/ship.jpg";
import logo from "../assets/nirmon-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Store token immediately
    localStorage.setItem("token", "nirmon-auth-token");

    localStorage.setItem(
      "user",
      JSON.stringify({
        email,
        role: "admin",
      })
    );

    navigate("/dashboard");
  };

  const handleViewerLogin = () => {
    localStorage.setItem("token", "viewer-auth-token");

    localStorage.setItem(
      "user",
      JSON.stringify({
        role: "viewer",
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col justify-center w-full max-w-xl px-10">
        <img src={logo} alt="logo" className="h-10 mb-8" />
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Sign In
          </button>
        </form>

        <button
          onClick={handleViewerLogin}
          className="mt-4 w-full border py-3 rounded-lg"
        >
          Continue as Viewer
        </button>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img
          src={shipImage}
          alt="Ship"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}