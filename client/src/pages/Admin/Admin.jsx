 import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [formData, setFormData] = useState({
    title: "", entry: "", prize: "", totalSlots: "", mode: "Solo", img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg"
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
      setFormData({ title: "", entry: "", prize: "", totalSlots: "", mode: "Solo", img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg" });
    } catch (err) { alert("Error adding"); }
  };

  // ✅ স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusUpdate = async (tournamentId, playerId, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tournaments/status/${tournamentId}/${playerId}`, {
        status: newStatus
      });
      alert(res.data.message);
      
      // ডাটা রিফ্রেশ করা যাতে লিস্টে পরিবর্তন দেখা যায়
      fetchTournaments();
      setSelectedMatch(null); // মোডাল ক্লোজ করা
    } catch (err) {
      alert("Status update failed!");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tournaments/${id}`);
        fetchTournaments();
      } catch (err) { alert("Error deleting"); }
    }
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* বাম পাশ: ফরম */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-indigo-400 font-mono italic underline">CREATE MATCH</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4 border border-gray-700 shadow-xl">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Tournament Title" className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 outline-none" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="entry" value={formData.entry} onChange={handleChange} placeholder="Entry Fee" className="p-2.5 bg-gray-700 rounded border border-gray-600" required />
            <input type="number" name="prize" value={formData.prize} onChange={handleChange} placeholder="Prize Pool" className="p-2.5 bg-gray-700 rounded border border-gray-600" required />
            <input type="number" name="totalSlots" value={formData.totalSlots} onChange={handleChange} placeholder="Total Slots" className="p-2.5 bg-gray-700 rounded border border-gray-600" required />
            <select name="mode" value={formData.mode} onChange={handleChange} className="p-2.5 bg-gray-700 rounded border border-gray-600 text-gray-300">
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Squad">Squad</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition">Launch Match 🚀</button>
        </form>
      </div>

      {/* ডান পাশ: টুর্নামেন্ট লিস্ট */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-red-500 font-mono italic underline">MANAGE</h1>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {tournaments.map((t) => (
            <div key={t._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-indigo-300">{t.title}</h3>
                <button onClick={() => handleDelete(t._id)} className="text-red-500 text-xs hover:bg-red-500/10 px-2 py-1 rounded">Delete</button>
              </div>
              <button 
                onClick={() => setSelectedMatch(t)} 
                className="w-full py-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/30 font-bold hover:bg-indigo-500 hover:text-white transition-all"
              >
                View Players ({t.players.length})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* প্লেয়ার লিস্ট ও এপ্রুভাল মোডাল */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gray-900 w-full max-w-4xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h2 className="text-xl font-bold text-indigo-400 tracking-wider uppercase">Player List: {selectedMatch.title}</h2>
              <button onClick={() => setSelectedMatch(null)} className="text-gray-500 hover:text-white text-3xl transition">&times;</button>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-500 text-xs uppercase tracking-widest border-b border-gray-800">
                  <tr>
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Phone</th>
                    <th className="pb-4">TrxID</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {selectedMatch.players.map((p) => (
                    <tr key={p._id} className="hover:bg-white/5 transition">
                      <td className="py-4 font-semibold">{p.name}</td>
                      <td className="py-4 text-gray-400 text-sm">{p.phone}</td>
                      <td className="py-4 font-mono text-indigo-400 text-sm">{p.trxID}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                          p.status === "Approved" ? "bg-green-500/20 text-green-500" : 
                          p.status === "Rejected" ? "bg-red-500/20 text-red-500" : 
                          "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        {p.status === "Pending" && (
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Approved")}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] rounded-md font-bold transition shadow-lg shadow-green-900/20"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Rejected")}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] rounded-md font-bold transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedMatch.players.length === 0 && <p className="text-center py-10 text-gray-600">No players registered yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;