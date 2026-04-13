 import React, { useState } from "react";
import axios from "axios";

const CreateTournament = () => {
  const [formData, setFormData] = useState({
    title: "",
    entry: "", 
    prize: "",
    totalSlots: 48,
    mode: "Solo",
    map: "Bermuda",
    time: "",
    img: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // আপনার server.js এ app.use("/api/tournaments", ...) থাকলে নিচের URL টি সঠিক
      const res = await axios.post("http://localhost:5000/api/tournaments", formData);
      
      if (res.data.success || res.status === 201) {
        alert("ম্যাচ সফলভাবে তৈরি হয়েছে! 🔥");
        
        // ফর্ম রিসেট
        setFormData({
          title: "",
          entry: "",
          prize: "",
          totalSlots: 48,
          mode: "Solo",
          map: "Bermuda",
          time: "",
          img: ""
        });
      }
    } catch (err) {
      // কনসোলে এরর চেক করার জন্য
      console.error("Error creating match:", err.response?.data);
      alert("এরর: " + (err.response?.data?.error || "সার্ভারে কানেক্ট হতে সমস্যা হচ্ছে!"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Create New Match</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Match Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Match Title</label>
            <input 
              type="text" name="title" value={formData.title} onChange={handleChange} required
              placeholder="e.g. Pro League Season 1"
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Entry Fee */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Entry Fee (৳)</label>
              <input 
                type="number" name="entry" value={formData.entry} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none"
              />
            </div>
            {/* Prize Pool */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Total Prize (৳)</label>
              <input 
                type="number" name="prize" value={formData.prize} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Match Mode */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Mode</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg">
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Squad">Squad</option>
              </select>
            </div>
            {/* Map Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Map</label>
              <select name="map" value={formData.map} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg">
                <option value="Bermuda">Bermuda</option>
                <option value="Purgatory">Purgatory</option>
                <option value="Kalahari">Kalahari</option>
                <option value="Nexterra">Nexterra</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             {/* Total Slots */}
             <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Total Slots</label>
              <input 
                type="number" name="totalSlots" value={formData.totalSlots} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none"
              />
            </div>
            {/* Match Time */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Date & Time</label>
              <input 
                type="datetime-local" name="time" value={formData.time} onChange={handleChange} required
                className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Tournament Image URL */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Image URL (Optional)</label>
            <input 
              type="text" name="img" value={formData.img} onChange={handleChange}
              placeholder="Paste image link here"
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Publish Match 🔥
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;