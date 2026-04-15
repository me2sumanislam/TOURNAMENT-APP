 import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { Trophy, Medal, Target } from "lucide-react";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard");
        setPlayers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="text-center mb-8">
          <Trophy className="mx-auto text-yellow-500 mb-2" size={48} />
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            Top <span className="text-indigo-500">Legends</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Global Ranking</p>
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player, index) => (
              <div 
                key={player._id} 
                className={`flex items-center justify-between p-4 rounded-2xl border ${
                  index === 0 ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-gray-900 border-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Number or Medal */}
                  <div className="w-8 flex justify-center">
                    {index === 0 ? <Medal className="text-yellow-500" size={24}/> : 
                     index === 1 ? <Medal className="text-gray-400" size={24}/> :
                     index === 2 ? <Medal className="text-amber-600" size={24}/> :
                     <span className="text-gray-600 font-black text-lg">#{index + 1}</span>}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <img src={player.avatar} alt="rank" className="w-10 h-10 rounded-full border-2 border-gray-800" />
                    <div>
                      <p className="font-black text-sm uppercase leading-none mb-1">{player.name}</p>
                      <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                        <Target size={10} className="text-red-500"/> {player.totalKills} Kills
                      </div>
                    </div>
                  </div>
                </div>

                {/* Points Display */}
                <div className="text-right">
                  <p className="text-indigo-400 font-black text-lg leading-none">{player.totalPoints}</p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">Points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;