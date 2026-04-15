 import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import { AuthContext } from "../../Context/AuthContext.jsx"; 
import TournamentCard from "../../components/TournamentCard.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { UserCircle } from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext); 
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // মোডাল এবং ফর্ম স্টেটস
  const [showModal, setShowModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  // ডাটা লোড করা
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tournaments");
        if (active) {
          setTournaments(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => { active = false; };
  }, []);

  const handleJoinClick = (tournament) => {
    if (!user) return alert("Please login first! 🔒");
    if (tournament.players.length >= tournament.totalSlots) return alert("Slot Full! 🚫");
    
    setSelectedTournament(tournament);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    // ডাটা ভ্যালিডেশন
    if (!formData.name.trim() || !formData.phone.trim()) {
      return alert("সব তথ্য সঠিকভাবে দিন! ⚠️");
    }

    try {
      // ✅ ব্যাকএন্ডের সাথে মিল রেখে 'name' কি-তে ডাটা পাঠানো হচ্ছে
      const response = await axios.post(
        `http://localhost:5000/api/tournaments/join/${selectedTournament._id}`,
        { 
          userId: user._id, 
          name: formData.name, // ব্যাকএন্ড এই 'name' ই খুঁজছে
          phone: formData.phone 
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        // জয়েন হওয়ার পর ডাটা রিফ্রেশ করার জন্য পেজ রিলোড
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Join error:", err);
      alert(err.response?.data?.error || "Join failed! Try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white">
      <Navbar />

      {/* হেডার সেকশন */}
      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="text-3xl font-bold text-indigo-400 uppercase tracking-tighter">🔥 Live Tournaments</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-lg border border-green-400/20">
              ৳ {user.balance}
            </span>
            <Link to="/profile" className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/50 px-4 py-2 rounded-xl transition-all">
              <UserCircle size={20} />
              <span className="font-semibold text-sm">Dashboard</span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">Login</Link>
        )}
      </div>

      {/* টুর্নামেন্ট কার্ড গ্রিড */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <TournamentCard
            key={t._id}
            tournament={{
              ...t,
              slots: t.totalSlots,
              remainingSlots: t.totalSlots - t.players.length,
            }}
            onJoin={handleJoinClick}
          />
        ))}
      </div>

      {/* জয়েন মোডাল */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-3xl w-full max-w-md border border-gray-700 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-2 text-white text-center uppercase tracking-tight">Confirm Entry</h2>
            <p className="text-center text-gray-400 text-sm mb-6">ম্যাচে জয়েন করতে আপনার গেমের নাম এবং নাম্বার দিন।</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-indigo-600/20 p-2 rounded-xl text-center min-w-[100px] border border-indigo-500/20">
                <p className="text-[10px] text-indigo-400 uppercase font-bold">Date</p>
                <p className="text-sm font-bold text-white">{selectedTournament.date || "TBA"}</p>
              </div>
              <div className="bg-indigo-600/20 p-2 rounded-xl text-center min-w-[100px] border border-indigo-500/20">
                <p className="text-[10px] text-indigo-400 uppercase font-bold">Time</p>
                <p className="text-sm font-bold text-white">{selectedTournament.time || "TBA"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">In-Game Name / UID</label>
                <input
                  type="text"
                  placeholder="Ex: Gaming_Pro"
                  className="w-full p-4 bg-gray-900 rounded-2xl border border-gray-700 text-white outline-none focus:border-indigo-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">WhatsApp / Phone</label>
                <input
                  type="text"
                  placeholder="017xxxxxxxx"
                  className="w-full p-4 bg-gray-900 rounded-2xl border border-gray-700 text-white outline-none focus:border-indigo-500 transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl text-center">
              <p className="text-xs text-gray-400">
                Entry Fee <span className="text-yellow-500 font-black text-sm">৳{selectedTournament.entry}</span> আপনার ওয়ালেট থেকে কাটা হবে।
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-2xl font-bold transition-all text-sm"
              >
                CANCEL
              </button>
              <button 
                onClick={handleConfirm} 
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all text-sm"
              >
                CONFIRM JOIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;