 import React, { useState } from "react";
import TournamentCard from "../../components/TournamentCard.jsx";
import tournamentsData from "../../data/tournaments.json";

const Home = () => {
  const [tournaments, setTournaments] = useState(tournamentsData);
  const [showModal, setShowModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [playerName, setPlayerName] = useState("");

  // Join click
  const handleJoinClick = (tournament) => {
    setSelectedTournament(tournament);
    setShowModal(true);
  };

  // Confirm join (🔥 updated logic)
  const handleConfirm = () => {
    if (!playerName.trim()) return;

    const updatedTournaments = tournaments.map((t) => {
      if (t.id === selectedTournament.id) {
        return {
          ...t,
          filledSlots: t.filledSlots + 1,
        };
      }
      return t;
    });

    setTournaments(updatedTournaments);

    alert(`🎮 ${playerName} joined ${selectedTournament.title}`);

    setPlayerName("");
    setSelectedTournament(null);
    setShowModal(false);
  };

  const handleCancel = () => {
    setPlayerName("");
    setSelectedTournament(null);
    setShowModal(false);
  };

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white">
      
      {/* Title */}
      <h1 className="text-3xl font-bold mb-5">🔥 Tournaments</h1>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {tournaments.map((t) => (
          <TournamentCard
            key={t.id}
            tournament={t}
            onJoin={handleJoinClick}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-80">

            <h2 className="text-xl font-semibold mb-3">
              Join {selectedTournament.title}
            </h2>

            <input
              type="text"
              placeholder="Enter your name / ID"
              className="w-full p-2 rounded mb-3 text-black"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={!playerName.trim()}
                className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;