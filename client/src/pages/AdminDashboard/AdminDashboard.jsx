 import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // সার্চের জন্য স্টেট

  const fetchAll = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // পেমেন্ট স্ট্যাটাস এবং অটো স্লট আপডেট
  const handleStatusUpdate = async (tId, pId, newStatus) => {
    try {
      // ব্যাকএন্ডে 'Verified' স্ট্যাটাস পাঠানো হচ্ছে (মডেল অনুযায়ী)
      const statusToSend = newStatus === "Approve" ? "Verified" : "Rejected";
      await axios.patch(`http://localhost:5000/api/tournaments/status/${tId}/${pId}`, { status: statusToSend });
      alert(`Status updated to ${statusToSend}`);
      fetchAll();
    } catch (err) {
      alert("Update failed!");
    }
  };

  // রুম আইডি এবং পাসওয়ার্ড আপডেট লজিক
  const handleRoomUpdate = async (tId) => {
    const roomID = document.getElementById(`rid-${tId}`).value;
    const roomPass = document.getElementById(`rpass-${tId}`).value;

    try {
      await axios.patch(`http://localhost:5000/api/tournaments/update-room/${tId}`, { 
        roomID, 
        roomPass 
      });
      alert("Room details updated successfully! 🚀");
      fetchAll();
    } catch (err) {
      alert("Failed to update room info");
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Admin Panel - BattleZone Style</h1>

      {/* কুইক সার্চ বার */}
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search Player by In-Game Name..." 
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-indigo-500 shadow-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {tournaments.map((t) => (
        <div key={t._id} className="mb-10 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-green-400">{t.title}</h2>
              <p className="text-gray-400 text-sm">{t.date} | {t.time} | Map: {t.map}</p>
            </div>

            {/* রুম আইডি ও পাসওয়ার্ড ইনপুট বক্স */}
            <div className="bg-gray-900 p-4 rounded-xl border border-indigo-500/30 w-full md:w-auto">
              <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Room Setup</h4>
              <div className="flex gap-2">
                <input 
                  id={`rid-${t._id}`} 
                  type="text" 
                  placeholder="Room ID" 
                  defaultValue={t.roomID}
                  className="bg-gray-800 p-2 rounded text-sm w-28 border border-gray-700"
                />
                <input 
                  id={`rpass-${t._id}`} 
                  type="text" 
                  placeholder="Pass" 
                  defaultValue={t.roomPass}
                  className="bg-gray-800 p-2 rounded text-sm w-20 border border-gray-700"
                />
                <button 
                  onClick={() => handleRoomUpdate(t._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-xs font-bold transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                  <th className="p-3">Slot</th>
                  <th className="p-3">Player Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">TrxID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {t.players
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) // সার্চ ফিল্টার
                  .map((p) => (
                  <tr key={p._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                    <td className="p-3 font-bold text-indigo-400">
                      {p.slotNumber !== 0 ? `#${p.slotNumber}` : "---"}
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-gray-400">{p.phone}</td>
                    <td className="p-3 font-mono text-xs text-indigo-300">{p.trxID}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.status === 'Verified' ? 'bg-green-500/20 text-green-400' : p.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(t._id, p._id, "Approve")}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-bold transition"
                      >
                        Approve
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate(t._id, p._id, "Reject")}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-bold transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;