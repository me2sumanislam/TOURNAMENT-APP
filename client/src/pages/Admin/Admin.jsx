 import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Trophy, DollarSign, Trash2, Users, X, Check, Key, Send, Save } from "lucide-react";

const Admin = () => {
  const [formData, setFormData] = useState({
    title: "", entry: "", prize: "", totalSlots: "", mode: "Solo", 
    time: "", date: "", 
    img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg"
  });
  
  const [tournaments, setTournaments] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [roomInputs, setRoomInputs] = useState({});

  // ✅ নতুন স্টেট: প্লেয়ারের কিল এবং পয়েন্ট ইনপুট রাখার জন্য
  const [playerStats, setPlayerStats] = useState({});

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
    } catch (err) { alert("Error adding match"); }
  };

  const handleRoomUpdate = async (id) => {
    const data = roomInputs[id];
    if (!data?.roomID || !data?.roomPass) return alert("ID and Password both are required!");
    try {
      await axios.patch(`http://localhost:5000/api/tournaments/update-room/${id}`, {
        roomID: data.roomID,
        roomPass: data.roomPass
      });
      alert("Room Info Sent to Players! 🚀");
      fetchTournaments();
    } catch (err) { alert("Failed to update room info"); }
  };

  const handleRoomInputChange = (matchId, field, value) => {
    setRoomInputs({ ...roomInputs, [matchId]: { ...roomInputs[matchId], [field]: value } });
  };

  // ✅ নতুন ফাংশন: ইউজারের স্ট্যাটাস ইনপুট হ্যান্ডেল করা
  const handleStatChange = (userId, field, value) => {
    setPlayerStats({
      ...playerStats,
      [userId]: { ...playerStats[userId], [field]: value }
    });
  };

  // ✅ নতুন ফাংশন: রেজাল্ট সাবমিট করা (Backend API লাগবে এর জন্য)
  const handleResultSubmit = async (userId, playerName) => {
    const stats = playerStats[userId];
    if (!stats?.kills || !stats?.points) return alert("Kills and Points are required!");

    try {
      // এই API-টি আমরা ব্যাকএন্ডে তৈরি করব
      await axios.post(`http://localhost:5000/api/auth/update-stats/${userId}`, {
        kills: Number(stats.kills),
        points: Number(stats.points)
      });
      alert(`Result updated for ${playerName}! 🏆`);
    } catch (err) {
      alert("Failed to update result");
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
      {/* Sidebar (Same as before) */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 space-y-8 hidden md:block">
        <h2 className="text-2xl font-black text-indigo-500 tracking-tighter uppercase">Admin Panel</h2>
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

      <div className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto">
        {/* Create Match Form (Same as before) */}
        <div className="space-y-6">
          <h1 className="text-3xl font-black italic text-indigo-400 underline decoration-indigo-800 uppercase">Create Match</h1>
          <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-5">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Match Name" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 transition" required />
            <div className="grid grid-cols-2 gap-5">
              <input type="number" name="entry" value={formData.entry} onChange={handleChange} placeholder="Entry Fee" className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <input type="number" name="prize" value={formData.prize} onChange={handleChange} placeholder="Prize Pool" className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <input type="number" name="totalSlots" value={formData.totalSlots} onChange={handleChange} placeholder="Slots" className="p-3 bg-gray-800 rounded-xl border border-gray-700" required />
              <select name="mode" value={formData.mode} onChange={handleChange} className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                  <option value="Solo">Solo</option>
                  <option value="Duo">Duo</option>
                  <option value="Squad">Squad</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-900/20">Launch Match 🚀</button>
          </form>
        </div>

        {/* Manage Matches Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-black italic text-red-500 underline decoration-red-900 uppercase">Manage Matches</h1>
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {tournaments.map((t) => (
              <div key={t._id} className="bg-gray-900 p-5 rounded-3xl border border-gray-800 hover:border-gray-600 transition-all space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-xl text-white uppercase tracking-tighter">{t.title}</h3>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{t.date} | {t.time}</p>
                  </div>
                  <button onClick={() => handleDelete(t._id)} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 size={18}/></button>
                </div>

                {/* Room ID Section (Mobile Friendly) */}
                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Room ID" className="bg-gray-950 border border-gray-700 p-2 rounded-lg text-xs" value={roomInputs[t._id]?.roomID || t.roomID || ""} onChange={(e) => handleRoomInputChange(t._id, 'roomID', e.target.value)} />
                    <input type="text" placeholder="Pass" className="bg-gray-950 border border-gray-700 p-2 rounded-lg text-xs" value={roomInputs[t._id]?.roomPass || t.roomPass || ""} onChange={(e) => handleRoomInputChange(t._id, 'roomPass', e.target.value)} />
                  </div>
                  <button onClick={() => handleRoomUpdate(t._id)} className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border border-indigo-600/30">
                    <Send size={12} /> Send Credentials
                  </button>
                </div>

                <button onClick={() => setSelectedMatch(t)} className="w-full py-3 bg-gray-800 text-gray-300 rounded-2xl font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 border border-gray-700">
                  <Users size={18} /> View & Result Update ({t.players?.length || 0})
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Player List & Result Update */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] p-4 backdrop-blur-md">
             <div className="bg-gray-900 w-full max-w-5xl rounded-[32px] border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
                 <h2 className="text-xl font-black text-white uppercase italic">Match Result: {selectedMatch.title}</h2>
                 <button onClick={() => setSelectedMatch(null)} className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition"><X /></button>
               </div>
               
               <div className="p-4 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-800 text-[10px] uppercase font-black">
                        <th className="pb-4 px-2">Player</th>
                        <th className="pb-4 px-2">Status</th>
                        <th className="pb-4 px-2">Kills</th>
                        <th className="pb-4 px-2">Points</th>
                        <th className="pb-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {selectedMatch.players.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-800/20 group">
                          <td className="py-4 px-2">
                            <p className="font-bold text-sm uppercase leading-tight">{p.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{p.phone}</p>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${p.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                              {p.status}
                            </span>
                          </td>
                          
                          {/* ✅ রেজাল্ট ইনপুট সেকশন */}
                          <td className="py-4 px-2">
                            <input 
                              type="number" 
                              placeholder="0"
                              className="w-16 bg-gray-950 border border-gray-700 p-1.5 rounded-lg text-xs font-bold text-center text-red-500 focus:border-red-500 outline-none transition"
                              onChange={(e) => handleStatChange(p.userId, 'kills', e.target.value)}
                            />
                          </td>
                          <td className="py-4 px-2">
                            <input 
                              type="number" 
                              placeholder="0"
                              className="w-16 bg-gray-950 border border-gray-700 p-1.5 rounded-lg text-xs font-bold text-center text-indigo-500 focus:border-indigo-500 outline-none transition"
                              onChange={(e) => handleStatChange(p.userId, 'points', e.target.value)}
                            />
                          </td>
                          
                          <td className="py-4 px-2 text-center">
                            {p.status === "Approved" ? (
                              <button 
                                onClick={() => handleResultSubmit(p.userId, p.name)}
                                className="bg-indigo-600/10 hover:bg-indigo-600 p-2 rounded-xl text-indigo-500 hover:text-white transition-all flex items-center justify-center mx-auto"
                                title="Save Stats"
                              >
                                <Save size={16}/>
                              </button>
                            ) : (
                              <div className="flex gap-2 justify-center">
                                <button onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Approved")} className="bg-green-600 p-2 rounded-lg hover:bg-green-500 transition shadow-lg shadow-green-900/20"><Check size={14}/></button>
                                <button onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Rejected")} className="bg-red-600 p-2 rounded-lg hover:bg-red-500 transition"><X size={14}/></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               <div className="p-4 bg-gray-800/10 text-[9px] text-gray-500 font-bold uppercase text-center border-t border-gray-800 italic">
                 Note: Only "Approved" players' results can be updated.
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;