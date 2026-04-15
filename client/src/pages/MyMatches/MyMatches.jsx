 import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { 
  Calendar, 
  Clock, 
  Key, 
  ShieldAlert, 
  Gamepad2, 
  Copy, 
  CheckCircle,
  RefreshCcw,
  Hash,
  Smartphone
} from "lucide-react";

const MyMatches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState(null);

  // ✅ ১. ডিভাইস ফিঙ্গারপ্রিন্ট তৈরি (Browser + Platform + Screen)
  const getFingerprint = () => {
    const fingerprint = btoa(navigator.userAgent + navigator.platform + screen.width);
    return fingerprint;
  };

  const fetchMyMatches = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      // ব্যাকএন্ড থেকে ইউজারের জয়েন করা ম্যাচগুলো আনা
      const res = await axios.get(`http://localhost:5000/api/tournaments/my-matches/${user._id}`);
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMatches();
  }, [user?._id]);

  // ✅ ২. রুম আইডি এবং স্লট চেক করার ফাংশন (ডিভাইস লকসহ)
  const handleViewRoom = async (tournamentId) => {
    const deviceId = getFingerprint();
    try {
      const res = await axios.get(`http://localhost:5000/api/tournaments/room-info/${tournamentId}/${user._id}`, {
        params: { deviceId } // ডিভাইস আইডি পাঠানো হচ্ছে
      });
      
      // ডাটাবেস আপডেট হওয়ার পর লোকাল স্টেট আপডেট করা যাতে আইডি দেখা যায়
      setMatches(prevMatches => 
        prevMatches.map(m => m._id === tournamentId ? { ...m, roomID: res.data.roomID, roomPass: res.data.roomPass } : m)
      );
    } catch (err) {
      alert(err.response?.data?.error || "Access Denied! Check your original device.");
    }
  };

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
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Syncing Game Slots...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 pb-24 font-['Inter']">
      <Navbar />
      
      <div className="max-w-xl mx-auto mt-4">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              MY <span className="text-indigo-500 italic">ENTRIES</span>
            </h1>
            <p className="text-gray-500 text-[9px] font-black uppercase mt-1 tracking-widest flex items-center gap-2">
              <Smartphone size={10} className="text-indigo-500"/> Device Locked System
            </p>
          </div>
          <button 
            onClick={fetchMyMatches}
            className="p-2.5 bg-gray-800/50 rounded-2xl text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="bg-gray-800/10 border-2 border-dashed border-gray-800/50 rounded-[40px] py-20 px-6 text-center">
            <Gamepad2 className="text-gray-700 mx-auto mb-4" size={40} />
            <h2 className="text-gray-400 font-bold">No joined matches found</h2>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => {
              const playerInfo = match.players.find(p => p.userId === user._id);
              return (
                <div key={match._id} className="bg-[#1e293b]/30 backdrop-blur-xl rounded-[35px] overflow-hidden border border-gray-700/30 shadow-2xl relative group">
                  
                  {/* Slot Badge */}
                  <div className="absolute top-0 right-10 bg-indigo-600 px-4 py-2 rounded-b-2xl shadow-lg z-10">
                     <p className="text-[8px] font-black uppercase text-indigo-200 leading-none mb-1">Your Slot</p>
                     <p className="text-xl font-black text-white leading-none text-center">{playerInfo?.slotNumber || "N/A"}</p>
                  </div>

                  <div className="p-6 pt-8">
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-4">{match.title}</h2>
                    
                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-1.5 bg-gray-800/40 px-3 py-1.5 rounded-xl border border-gray-700/50 text-indigo-400 text-[9px] font-black uppercase">
                        <Calendar size={12} /> {match.date}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-800/40 px-3 py-1.5 rounded-xl border border-gray-700/50 text-indigo-400 text-[9px] font-black uppercase">
                        <Clock size={12} /> {match.time}
                      </div>
                    </div>

                    {/* Room Details Box */}
                    <div className="bg-[#0f172a] rounded-[25px] p-5 border border-gray-800/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Key size={14} className="text-indigo-500"/>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Room Credentials</span>
                      </div>
                      
                      {match.roomID ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className="bg-gray-800/20 p-4 rounded-2xl border border-gray-700/30 active:scale-95 transition-all relative cursor-pointer group"
                            onClick={() => copyToClipboard(match.roomID, match._id + 'id')}
                          >
                            <p className="text-[7px] text-gray-500 font-black uppercase mb-1">Match ID</p>
                            <p className="text-lg font-mono font-black text-white tracking-widest">{match.roomID}</p>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {copiedId === match._id + 'id' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={12} className="text-gray-500" />}
                            </div>
                          </div>

                          <div 
                            className="bg-gray-800/20 p-4 rounded-2xl border border-gray-700/30 active:scale-95 transition-all relative cursor-pointer group"
                            onClick={() => copyToClipboard(match.roomPass, match._id + 'pass')}
                          >
                            <p className="text-[7px] text-gray-500 font-black uppercase mb-1">Password</p>
                            <p className="text-lg font-mono font-black text-white tracking-widest">{match.roomPass}</p>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {copiedId === match._id + 'pass' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={12} className="text-gray-500" />}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleViewRoom(match._id)}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                        >
                          Unlock Room Access
                        </button>
                      )}
                    </div>

                    <div className="mt-5 flex items-start gap-3 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                      <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] font-bold text-red-400/80 leading-relaxed uppercase tracking-tight">
                        Warning: নির্ধারিত স্লটে ({playerInfo?.slotNumber || "N/A"}) না বসলে কিক আউট করা হবে। এই আইডিটি শুধুমাত্র এই ডিভাইসের জন্য লকড। ফোন শেয়ার করলে আইডি দেখতে পাবেন না।
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMatches;