 import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [tournaments, setTournaments] = useState([]);

  const fetchAll = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleStatusUpdate = async (tId, pId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/tournaments/status/${tId}/${pId}`, { status: newStatus });
      alert(`Status updated to ${newStatus}`);
      fetchAll(); // ডাটা রিফ্রেশ
    } catch (err) {
      alert("Update failed!");
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Admin Panel - Join Requests</h1>
      
      {tournaments.map((t) => (
        <div key={t._id} className="mb-10 bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-green-400">{t.title}</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                  <th className="p-3">Player Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">TrxID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {t.players.map((p) => (
                  <tr key={p._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.phone}</td>
                    <td className="p-3 font-mono text-indigo-300">{p.trxID}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(t._id, p._id, "Approved")}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition"
                      >
                        Approve
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate(t._id, p._id, "Rejected")}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
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