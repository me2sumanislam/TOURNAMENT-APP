 import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ব্যাকএন্ড এপিআই কল (নিশ্চিত করুন ব্যাকএন্ড সার্ভার চালু আছে)
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      
      if (res.status === 201 || res.status === 200) {
        alert("Registration Successful! Now Login.");
        navigate("/login");
      }
    } catch (err) {
      // ব্যাকএন্ড থেকে পাঠানো এরর মেসেজ দেখানো
      alert(err.response?.data?.message || err.response?.data || "Registration failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-5 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-center text-indigo-400">Create Account</h2>
        <p className="text-gray-400 text-center mb-6">Join the ultimate gaming community</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Md. Forhad Jibon" 
              className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 transition focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 transition focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 transition focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 active:scale-95 mt-4 cursor-pointer">
            Register Now
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;