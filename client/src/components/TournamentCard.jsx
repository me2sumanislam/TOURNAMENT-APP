 import React from "react";

const TournamentCard = ({ tournament, onJoin }) => {
  const { title, entry, prize, slots, remainingSlots, mode, img } = tournament;

  // স্লট ফুল কি না চেক করা
  const isFull = remainingSlots === 0;
  
  // কত শতাংশ স্লট পূর্ণ হয়েছে তা হিসাব করা
  const filledPercentage = ((slots - remainingSlots) / slots) * 100;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group">
      {/* কার্ডের উপরের ইমেজ বা ব্যানার অংশ */}
      <div className="relative h-32 bg-indigo-900/30 overflow-hidden">
        <img 
          src={img || "https://via.placeholder.com/400x200?text=Tournament"} 
          alt={title} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-indigo-400 border border-indigo-500/30 uppercase">
          {mode || "Solo"}
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-white truncate mb-4">{title}</h2>

        {/* এন্ট্রি এবং প্রাইজ সেকশন */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-900/50 p-2 rounded-xl border border-gray-700 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Entry Fee</p>
            <p className="text-green-400 font-bold">৳{entry}</p>
          </div>
          <div className="bg-gray-900/50 p-2 rounded-xl border border-gray-700 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Prize Pool</p>
            <p className="text-yellow-500 font-bold">৳{prize}</p>
          </div>
        </div>

        {/* স্লট প্রগ্রেস বার */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400 font-medium">Slots Filled</span>
            <span className={`text-xs font-bold ${isFull ? "text-red-500" : "text-indigo-400"}`}>
              {slots - remainingSlots} / {slots}
            </span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${isFull ? "bg-red-500" : "bg-indigo-500"}`}
              style={{ width: `${filledPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* বাটন */}
        <button
          onClick={() => onJoin(tournament)}
          disabled={isFull}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-lg 
            ${isFull 
              ? "bg-gray-700 text-gray-500 cursor-not-allowed shadow-none" 
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-500/20 text-white"
            }`}
        >
          {isFull ? "MATCH FULL" : "JOIN NOW"}
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;