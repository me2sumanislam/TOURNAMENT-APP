 import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      login(res.data); // Context এ ইউজার ডাটা সেভ হবে
      navigate("/");   // লগইন শেষে হোম পেজে নিয়ে যাবে
    } catch (err) {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="min-h-[calc(100-64px)] flex items-center justify-center bg-gray-900 p-5">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 text-white outline-none focus:border-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 text-white outline-none focus:border-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-500/20">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6">
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;