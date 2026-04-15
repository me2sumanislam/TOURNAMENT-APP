 import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { AuthContext } from "../../Context/AuthContext"; 
import { Trophy } from "lucide-react"; // লিডারবোর্ড আইকনের জন্য

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); 

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* লোগো */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-500 cursor-pointer">
              GAMER<span className="text-white">ZONE</span>
            </Link>
          </div>

          {/* মেনু আইটেমস (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-300 hover:text-indigo-400 transition font-medium">Home</Link>
            
            {/* ✅ Leaderboard লিঙ্ক যোগ করা হয়েছে */}
            <Link to="/leaderboard" className="flex items-center gap-1 text-gray-300 hover:text-yellow-500 transition font-medium">
              <Trophy size={16} /> Leaderboard
            </Link>

            {user && (
              <Link to="/my-matches" className="text-gray-300 hover:text-indigo-400 transition font-medium">
                My Matches
              </Link>
            )}

            <Link to="/matches" className="text-gray-300 hover:text-indigo-400 transition font-medium">Matches</Link>
            
            {/* অ্যাডমিন প্যানেল লিঙ্ক */}
            {user && user.role === "admin" && (
              <Link to="/admin" className="text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 rounded-md transition font-bold animate-pulse">
                Admin Panel
              </Link>
            )}
          </div>

          {/* ডান পাশের বাটন (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm italic">Hi, {user.name}</span>
                <button 
                  onClick={logout}
                  className="bg-red-500/10 text-red-500 px-5 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 block"
              >
                Login
              </Link>
            )}
          </div>

          {/* মোবাইল মেনু বাটন */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল মেনু ড্রপডাউন */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:bg-gray-700 p-2 rounded-lg text-base">Home</Link>
            
            {/* ✅ মোবাইল মেনুতে Leaderboard */}
            <Link to="/leaderboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-yellow-500 hover:bg-gray-700 p-2 rounded-lg text-base font-bold uppercase">
              <Trophy size={18} /> Leaderboard
            </Link>

            {user && (
              <Link to="/my-matches" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:bg-gray-700 p-2 rounded-lg text-base">
                My Matches
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-indigo-400 font-bold bg-indigo-500/10 p-2 rounded-lg text-base">
                Admin Panel
              </Link>
            )}

            <Link to="/matches" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:bg-gray-700 p-2 rounded-lg text-base">Matches</Link>
            
            <div className="pt-2 border-t border-gray-700 mt-2">
              {user ? (
                <div className="space-y-2">
                  <p className="text-indigo-400 px-2 text-sm italic underline">Logged in as: {user.name}</p>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center bg-indigo-600 text-white py-3 rounded-xl font-bold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;