 import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Trophy, DollarSign, Trash2, Users, X, Save, Send } from "lucide-react";

const Admin = () => {
  const [formData, setFormData] = useState({
    title: "", entry: "", prize: "", totalSlots: "", mode: "Solo", 
    time: "", date: "", 
    img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg"
  });
  
  const [tournaments, setTournaments] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [roomInputs, setRoomInputs] = useState({}); // Room ID/Pass ইনপুট হ্যান্ডেল করার জন্য
  const [playerStats, setPlayerStats] = useState({});

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tournaments");
      if (res.data) setTournaments(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
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

  // ✅ Room ID & Password আপডেট করার ফাংশন
  const handleRoomUpdate = async (id) => {
    const data = roomInputs[id];
    if (!data?.roomID || !data?.roomPass) return alert("Room ID and Password both are required!");
    try {
      await axios.patch(`http://localhost:5000/api/tournaments/update-room/${id}`, {
        roomID: data.roomID,
        roomPass: data.roomPass
      });
      alert("Room Info Updated! ইউজাররা এখন এটি দেখতে পাবে। 🚀");
      fetchTournaments();
      // আপডেট সফল হলে ইনপুট ক্লিয়ার করা
      setRoomInputs({ ...roomInputs, [id]: { roomID: "", roomPass: "" } });
    } catch (err) { alert("Failed to update room info"); }
  };

  const handleRoomInputChange = (matchId, field, value) => {
    setRoomInputs({ ...roomInputs, [matchId]: { ...roomInputs[matchId], [field]: value } });
  };

  const handleStatChange = (userId, field, value) => {
    setPlayerStats({ ...playerStats, [userId]: { ...playerStats[userId], [field]: value } });
  };

  const handleResultSubmit = async (userId, playerName) => {
    const stats = playerStats[userId];
    const updatedKills = Number(stats?.kills !== undefined ? stats.kills : (selectedMatch.players.find(p => p.userId === userId)?.kills || 0));
    const updatedPoints = Number(stats?.points !== undefined ? stats.points : (selectedMatch.players.find(p => p.userId === userId)?.points || 0));

    try {
      const res = await axios.patch(`http://localhost:5000/api/tournaments/update-player-admin/${selectedMatch?._id}/${userId}`, {
        kills: updatedKills,
        points: updatedPoints
      });

      if (res.data && res.data.success) {
        alert(`Result updated for ${playerName}! 🏆`);
        const updatedTournament = res.data.data;
        setSelectedMatch(updatedTournament);
        setTournaments(prev => prev.map(t => (t._id === updatedTournament._id ? updatedTournament : t)));
      }
    } catch (err) { alert("Failed to update result"); }
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
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 hidden md:block">
        <h2 className="text-2xl font-black text-indigo-500 uppercase mb-8">Admin</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 p-3 bg-indigo-600 rounded-lg font-bold"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/admin/payments" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-400 transition"><DollarSign size={20} /> Payments</Link>
        </nav>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto">
        {/* Create Match (এখানে রুম আইডি পাসওয়ার্ড নেই) */}
        <div className="space-y-6">
          <h1 className="text-3xl font-black italic text-indigo-400 uppercase">Create Match</h1>
          <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-3xl border border-gray-800 space-y-5">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Match Name" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 outline-none" required />
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
            <button type="submit" className="w-full py-4 bg-indigo-600 rounded-2xl font-black">Launch Match 🚀</button>
          </form>
        </div>

        {/* Manage Matches Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-black italic text-red-500 uppercase">Manage Matches</h1>
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            {tournaments.map((t) => (
              <div key={t._id} className="bg-gray-900 p-6 rounded-3xl border border-gray-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-xl uppercase">{t.title}</h3>
                    <p className="text-[10px] text-indigo-500 font-bold">{t.date} | {t.time}</p>
                  </div>
                  <button onClick={() => handleDelete(t._id)} className="p-2 bg-red-500/10 text-red-500 rounded-full"><Trash2 size={18}/></button>
                </div>

                {/* ✅ Room ID & Password Update Section */}
                <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
                    <p className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-1"><Send size={12}/> Update Room Info</p>
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                          placeholder="Room ID" 
                          value={roomInputs[t._id]?.roomID || ""} 
                          onChange={(e) => handleRoomInputChange(t._id, 'roomID', e.target.value)}
                          className="p-2 bg-gray-800 rounded-lg text-xs border border-gray-700 outline-none" 
                        />
                        <input 
                          placeholder="Password" 
                          value={roomInputs[t._id]?.roomPass || ""} 
                          onChange={(e) => handleRoomInputChange(t._id, 'roomPass', e.target.value)}
                          className="p-2 bg-gray-800 rounded-lg text-xs border border-gray-700 outline-none" 
                        />
                    </div>
                    <button 
                      onClick={() => handleRoomUpdate(t._id)}
                      className="w-full py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                        Update Room Access
                    </button>
                </div>

                <button onClick={() => setSelectedMatch(t)} className="w-full py-3 bg-gray-800 text-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-700 transition-all">
                  <Users size={18} /> View Players ({t.players?.length || 0})
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Results (আগের মতোই থাকবে) */}
        {selectedMatch && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] p-4 backdrop-blur-md">
                <div className="bg-gray-900 w-full max-w-4xl rounded-[32px] border border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-black uppercase italic">Players List: {selectedMatch.title}</h2>
                        <button onClick={() => setSelectedMatch(null)} className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition"><X /></button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-500 text-[10px] uppercase font-black border-b border-gray-800">
                                    <th className="pb-4">Player</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-center">Kills</th>
                                    <th className="pb-4 text-center">Points</th>
                                    <th className="pb-4 text-center">Save</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMatch.players?.map((p) => (
                                    <tr key={p._id} className="border-b border-gray-800/50">
                                        <td className="py-4 font-bold text-sm uppercase">{p.name}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black ${p.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{p.status}</span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <input type="number" defaultValue={p.kills} onChange={(e) => handleStatChange(p.userId, 'kills', e.target.value)} className="w-12 bg-gray-800 border border-gray-700 rounded p-1 text-center text-xs" />
                                        </td>
                                        <td className="py-4 text-center">
                                            <input type="number" defaultValue={p.points} onChange={(e) => handleStatChange(p.userId, 'points', e.target.value)} className="w-12 bg-gray-800 border border-gray-700 rounded p-1 text-center text-xs" />
                                        </td>
                                        <td className="py-4 text-center">
                                            <button onClick={() => handleResultSubmit(p.userId, p.name)} className="p-2 bg-indigo-600/20 text-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white transition"><Save size={16}/></button>
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