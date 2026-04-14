 import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Link ইমপোর্ট করা হয়েছে
import { AuthContext } from "../../Context/AuthContext.jsx"; // AuthContext যোগ করা হয়েছে
import TournamentCard from "../../components/TournamentCard.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { UserCircle } from "lucide-react"; // প্রোফাইল আইকনের জন্য

const Home = () => {
  const { user } = useContext(AuthContext); // ইউজার ডাটা নেওয়া হলো
  const [tournaments, setTournaments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    trxID: ""
  });

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tournaments");
      setTournaments(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleJoinClick = (tournament) => {
    if (!user) {
      alert("Please login first to join! 🔒");
      return;
    }
    if (tournament.players.length >= tournament.totalSlots) {
      alert("Slot Full! 🚫");
      return;
    }
    setSelectedTournament(tournament);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const { name, phone, trxID } = formData;
    
    if (!name || !phone || !trxID) {
      alert("সবগুলো তথ্য সঠিকভাবে দিন! ⚠️");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/tournaments/join/${selectedTournament._id}`,
        { name, phone, trxID }
      );

      alert(response.data.message);
      fetchTournaments(); 
      setShowModal(false);
      setFormData({ name: "", phone: "", trxID: "" }); 
    } catch (err) {
      alert("Join failed! Try again.");
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

      {/* প্রোফাইল নেভিগেশন সেকশন */}
      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="text-3xl font-bold text-indigo-400">🔥 Live Tournaments</h1>
        
        {user ? (
          <Link 
            to="/profile" 
            className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/50 px-4 py-2 rounded-xl transition-all duration-300"
          >
            <UserCircle size={20} />
            <span className="font-semibold text-sm">My Dashboard</span>
          </Link>
        ) : (
          <Link 
            to="/login" 
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-bold border border-gray-700"
          >
            Login
          </Link>
        )}
      </div>

      {/* টুর্নামেন্ট লিস্ট */}
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
       
      {/* Modern Join Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-1 text-white text-center">Join Match</h2>
            <p className="text-center text-sm text-gray-400 mb-6 italic">
              Send <span className="text-green-400 font-bold">৳{selectedTournament.entry}</span> to <span className="text-white font-bold">01749684030</span> (Bkash/Nagad)
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 ml-1">In-Game Name / UID</label>
                <input
                  type="text"
                  placeholder="e.g. Forhad_Pro"
                  className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 ml-1">Sender Phone Number</label>
                <input
                  type="text"
                  placeholder="017xxxxxxx"
                  className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 ml-1">Transaction ID (TrxID)</label>
                <input
                  type="text"
                  placeholder="TRX123456"
                  className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700 outline-none focus:border-indigo-500 text-white uppercase"
                  value={formData.trxID}
                  onChange={(e) => setFormData({...formData, trxID: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-700 rounded-xl font-bold hover:bg-gray-600 transition">Cancel</button>
              <button 
                onClick={handleConfirm}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-lg transition-all active:scale-95"
              >
                Confirm Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;