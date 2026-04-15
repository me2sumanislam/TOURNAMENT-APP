 import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { Calendar, Clock, Trophy, Key, ShieldAlert } from "lucide-react";

const MyMatches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyMatches = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tournaments/my-matches/${user._id}`);
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchMyMatches();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-2xl font-black text-indigo-400 mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> MY JOINED MATCHES
        </h1>

        {matches.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-10 text-center">
            <p className="text-gray-400">আপনি এখনো কোনো ম্যাচে জয়েন করেননি।</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => (
              <div key={match._id} className="bg-gray-800 rounded-[25px] overflow-hidden border border-gray-700 shadow-xl">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-indigo-300">{match.title}</h2>
                    <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/30">
                      JOINED ✅
                    </span>
                  </div>

                  <div className="flex gap-4 mb-5 text-sm text-gray-400">
                    <div className="flex items-center gap-1"><Calendar size={14}/> {match.date}</div>
                    <div className="flex items-center gap-1"><Clock size={14}/> {match.time}</div>
                  </div>

                  {/* রুম ইনফো সেকশন - যা মোবাইল ফ্রেন্ডলি এবং সিকিউর */}
                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-3 uppercase tracking-widest">
                      <Key size={14}/> Room Details
                    </div>
                    
                    {match.roomID ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                          <p className="text-[10px] text-gray-500 uppercase">Room ID</p>
                          <p className="text-lg font-mono font-bold text-white select-all">{match.roomID}</p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                          <p className="text-[10px] text-gray-500 uppercase">Password</p>
                          <p className="text-lg font-mono font-bold text-white select-all">{match.roomPass}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-yellow-500/80 bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10">
                        <ShieldAlert size={18} />
                        <p className="text-xs font-medium">রুম আইডি এবং পাসওয়ার্ড ম্যাচ শুরুর ১০ মিনিট আগে এখানে দেওয়া হবে।</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMatches;