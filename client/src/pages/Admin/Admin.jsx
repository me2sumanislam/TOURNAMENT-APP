 import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  // ✅ ১. formData তে time এবং date যুক্ত করা হয়েছে
  const [formData, setFormData] = useState({
    title: "", 
    entry: "", 
    prize: "", 
    totalSlots: "", 
    mode: "Solo", 
    time: "", // নতুন যুক্ত
    date: "", // নতুন যুক্ত
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
      // ✅ ব্যাকএন্ডে ডাটা পাঠানো
      await axios.post("http://localhost:5000/api/tournaments", formData);
      alert("Tournament Added! 🔥");
      fetchTournaments();
      // রিসেট করার সময় নতুন ফিল্ডগুলোও খালি করা হচ্ছে
      setFormData({ 
        title: "", entry: "", prize: "", totalSlots: "", mode: "Solo", 
        time: "", date: "", 
        img: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg" 
      });
    } catch (err) { 
      console.error(err.response.data);
      alert("Error adding: " + (err.response?.data?.error || "Server Error")); 
    }
  };

  const handleStatusUpdate = async (tournamentId, playerId, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tournaments/status/${tournamentId}/${playerId}`, {
        status: newStatus
      });
      alert(res.data.message);
      fetchTournaments();
      setSelectedMatch(null); 
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
            
            {/* ✅ ২. Date এবং Time ইনপুট ফিল্ড যুক্ত করা হয়েছে */}
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2.5 bg-gray-700 rounded border border-gray-600 text-gray-300" required />
            <input type="time" name="time" value={formData.time} onChange={handleChange} className="p-2.5 bg-gray-700 rounded border border-gray-600 text-gray-300" required />
            
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
                <p className="text-xs text-gray-400">{t.date} | {t.time}</p>
                <button onClick={() => handleDelete(t._id)} className="text-red-500 text-xs hover:bg-red-500/10 px-2 py-1 rounded">Delete</button>
              </div>
              <button 
                onClick={() => setSelectedMatch(t)} 
                className="w-full py-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/30 font-bold hover:bg-indigo-500 hover:text-white transition-all"
              >
                View Players ({t.players?.length || 0})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* মোডাল সেকশন একই থাকবে... */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
           {/* ... আগের মোডাল কোড এখানে বসবে ... */}
           <div className="bg-gray-900 w-full max-w-4xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
               <h2 className="text-xl font-bold text-indigo-400">Player List: {selectedMatch.title}</h2>
               <button onClick={() => setSelectedMatch(null)} className="text-gray-500 hover:text-white text-3xl">&times;</button>
             </div>
             <div className="p-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Phone</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMatch.players.map((p) => (
                      <tr key={p._id} className="border-b border-gray-800/50">
                        <td className="py-4">{p.name}</td>
                        <td className="py-4">{p.phone}</td>
                        <td className="py-4">{p.status}</td>
                        <td className="py-4 text-center">
                          {p.status === "Pending" && (
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Approved")} className="bg-green-600 px-2 py-1 rounded text-xs">Approve</button>
                              <button onClick={() => handleStatusUpdate(selectedMatch._id, p._id, "Rejected")} className="bg-red-600 px-2 py-1 rounded text-xs">Reject</button>
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
  );
};

export default Admin;