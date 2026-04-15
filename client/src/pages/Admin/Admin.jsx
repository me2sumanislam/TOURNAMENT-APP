 import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Trophy, DollarSign, Trash2, Users, X, Check } from "lucide-react";

const Admin = () => {
  const [formData, setFormData] = useState({
    title: "", 
    entry: "", 
    prize: "", 
    totalSlots: "", 
    mode: "Solo", 
    time: "", 
    date: "", 
    img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg"
  });
  
  const [tournaments, setTournaments] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tournaments");
      setTournaments(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTournaments(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tournaments", formData);
      alert("Tournament Added! 🔥");
      fetchTournaments();
      setFormData({ 
        title: "", entry: "", prize: "", totalSlots: "", mode: "Solo", 
        time: "", date: "", 
        img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg" 
      });
    } catch (err) { 
      alert("Error adding match"); 
    }
  };

  const handleStatusUpdate = async (tournamentId, playerId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/tournaments/status/${tournamentId}/${playerId}`, { status: newStatus });
      alert("Player status updated!");
      fetchTournaments();
      setSelectedMatch(null); 
    } catch (err) { alert("Failed to update"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ম্যাচটি ডিলিট করতে চান?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tournaments/${id}`);
        fetchTournaments();
      } catch (err) { alert("Error deleting"); }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      
      {/* 🟢 ১. বাম পাশের সাইডবার (Sidebar) */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 space-y-8 hidden md:block">
        <h2 className="text-2xl font-black text-indigo-500 tracking-tighter">ADMIN PANEL</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 p-3 bg-indigo-600 rounded-lg font-bold">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/payments" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
            <DollarSign size={20} /> Payment Requests
          </Link>
          <Link to="/" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
            <Trophy size={20} /> View Site
          </Link>
        </nav>
      </div>

      {/* 🔵 ২. মেইন কন্টেন্ট এলাকা */}
      <div className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto">
        
        {/* ফরম সেকশন */}
        <div className="space-y-6">
          <header className="flex justify-between items-center">
             <h1 className="text-3xl font-black italic text-indigo-400 underline decoration-indigo-800">CREATE MATCH</h1>
             <Link to="/admin/payments" className="md:hidden p-2 bg-indigo-600 rounded-full"><DollarSign /></Link>
          </header>

          <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-5">
            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tournament Title</label>
               <input name="title" value={formData.title} onChange={handleChange} placeholder="Match Name (e.g. Friday Special)" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-indigo-500 outline-none transition" required />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <input type="number" name="entry" value={formData.entry} onChange={handleChange} placeholder="Entry Fee" className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <input type="number" name="prize" value={formData.prize} onChange={handleChange} placeholder="Prize Pool" className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-3 bg-gray-800 rounded-xl border border-gray-700 text-gray-400" required />
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="p-3 bg-gray-800 rounded-xl border border-gray-700 text-gray-400" required />
              <input type="number" name="totalSlots" value={formData.totalSlots} onChange={handleChange} placeholder="Slots (e.g. 48)" className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <select name="mode" value={formData.mode} onChange={handleChange} className="p-3 bg-gray-800 rounded-xl border border-gray-700 text-gray-400">
                  <option value="Solo">Solo</option>
                  <option value="Duo">Duo</option>
                  <option value="Squad">Squad</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-lg shadow-lg shadow-indigo-900/20 transition-all active:scale-95">Launch Match 🚀</button>
          </form>
        </div>

        {/* ম্যানেজ সেকশন */}
        <div className="space-y-6">
          <h1 className="text-3xl font-black italic text-red-500 underline decoration-red-900">MANAGE MATCHES</h1>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar">
            {tournaments.map((t) => (
              <div key={t._id} className="bg-gray-900 p-5 rounded-3xl border border-gray-800 hover:border-gray-600 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-xl text-white">{t.title}</h3>
                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{t.date} | {t.time}</p>
                  </div>
                  <button onClick={() => handleDelete(t._id)} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 size={18}/></button>
                </div>
                <button 
                  onClick={() => setSelectedMatch(t)} 
                  className="w-full py-3 bg-gray-800 text-gray-300 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Users size={18} /> View Players ({t.players?.length || 0})
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🟡 প্লেয়ার লিস্ট মোডাল */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
             <div className="bg-gray-900 w-full max-w-4xl rounded-[40px] border border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
               <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                 <h2 className="text-2xl font-black text-white">Match: {selectedMatch.title}</h2>
                 <button onClick={() => setSelectedMatch(null)} className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition"><X /></button>
               </div>
               <div className="p-8 overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-800 text-xs uppercase tracking-tighter">
                        <th className="pb-4">Name</th>
                        <th className="pb-4">Phone</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {selectedMatch.players.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-800/20">
                          <td className="py-4 font-bold">{p.name}</td>
                          <td className="py-4 text-gray-400">{p.phone}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black ${p.status === 'Approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4">
                            {p.status === "Pending" && (
                              <div className="flex gap-2 justify-center">
                                <button onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Approved")} className="bg-green-600 p-2 rounded-lg hover:bg-green-500"><Check size={14}/></button>
                                <button onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Rejected")} className="bg-red-600 p-2 rounded-lg hover:bg-red-500"><X size={14}/></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;