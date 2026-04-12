 import React from "react";

const TournamentCard = ({ tournament, onJoin }) => {
  const { title, entry, prize, slots, remainingSlots } = tournament;

  const isFull = remainingSlots === 0;

  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      {/* Info */}
      <div className="mt-3 space-y-1 text-gray-300">
        <p>💰 Entry Fee: ৳{entry}</p>
        <p>🏆 Prize Pool: ৳{prize}</p>
        <p>👥 Slots: {remainingSlots}/{slots}</p>
      </div>

      {/* Button */}
      <button
        onClick={() => onJoin(tournament)}
        disabled={isFull}
        className={`mt-4 w-full py-2 rounded-lg font-medium transition 
          ${isFull 
            ? "bg-gray-500 cursor-not-allowed" 
            : "bg-indigo-500 hover:bg-indigo-600"
          }`}
      >
        {isFull ? "Full" : "Join Now"}
      </button>
    </div>
  );
};

export default TournamentCard;