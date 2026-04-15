 import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Key, 
  ShieldAlert, 
  Gamepad2, 
  Copy, 
  CheckCircle,
  RefreshCcw
} from "lucide-react";

const MyMatches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchMyMatches = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      // ব্যাকএন্ড এপিআই কল
      const res = await axios.get(`http://localhost:5000/api/tournaments/my-matches/${user._id}`);
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMatches();
  }, [user?._id]); // ইউজার আইডি লোড হওয়া মাত্রই কল হবে

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
        <p className="text-indigo-400 text-xs font-bold animate-pulse uppercase tracking-widest">Checking Your Slots...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 pb-24">
      <Navbar />
      
      <div className="max-w-xl mx-auto mt-4">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
              My <span className="text-indigo-500">Joined</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Tournament Entries</p>
          </div>
          <button 
            onClick={fetchMyMatches}
            className="p-2 bg-gray-800 rounded-xl text-indigo-400 active:rotate-180 transition-transform duration-500"
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="bg-gray-800/20 border-2 border-dashed border-gray-800 rounded-[35px] py-16 px-6 text-center">
            <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="text-gray-600" size={30} />
            </div>
            <h2 className="text-white font-bold mb-1">কোনো ম্যাচ পাওয়া যায়নি!</h2>
            <p className="text-gray-500 text-xs max-w-[200px] mx-auto leading-relaxed">
              আপনি এখনো কোনো টুর্নামেন্টে জয়েন করেননি। হোম পেজ থেকে জয়েন করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {matches.map((match) => (
              <div key={match._id} className="bg-[#1e293b]/50 backdrop-blur-sm rounded-[30px] overflow-hidden border border-gray-700/50 shadow-xl">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-black text-white leading-tight mb-2 uppercase italic">{match.title}</h2>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-black uppercase">
                          <Calendar size={12} /> {match.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-black uppercase">
                          <Clock size={12} /> {match.time}
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
                       <p className="text-green-500 text-[9px] font-black tracking-tighter">CONFIRMED ✅</p>
                    </div>
                  </div>

                  {/* Room Details Box */}
                  <div className="mt-6 bg-[#0f172a] rounded-2xl p-4 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2 text-gray-500 font-black text-[9px] uppercase tracking-[0.2em]">
                        <Key size={12} className="text-indigo-500"/> Room Access
                      </div>
                      {!match.roomID && (
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                           <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest">Updating</span>
                        </div>
                      )}
                    </div>
                    
                    {match.roomID ? (
                      <div className="grid grid-cols-2 gap-3">
                        {/* ID Section */}
                        <div 
                          className="bg-gray-800/30 p-3 rounded-2xl border border-gray-700/50 active:scale-95 transition-all relative"
                          onClick={() => copyToClipboard(match.roomID, 'id')}
                        >
                          <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Match ID</p>
                          <p className="text-base font-mono font-black text-white tracking-wider">{match.roomID}</p>
                          <div className="absolute top-3 right-3">
                            {copiedId === 'id' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={12} className="text-gray-600" />}
                          </div>
                        </div>

                        {/* Password Section */}
                        <div 
                          className="bg-gray-800/30 p-3 rounded-2xl border border-gray-700/50 active:scale-95 transition-all relative"
                          onClick={() => copyToClipboard(match.roomPass, 'pass')}
                        >
                          <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Password</p>
                          <p className="text-base font-mono font-black text-white tracking-wider">{match.roomPass}</p>
                          <div className="absolute top-3 right-3">
                            {copiedId === 'pass' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={12} className="text-gray-600" />}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 text-yellow-500/80 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                        <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">
                          ম্যাচ শুরুর ১০-১৫ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে। পেজটি রিফ্রেশ করুন।
                        </p>
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