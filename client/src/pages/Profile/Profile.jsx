 // src/pages/Profile/Profile.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import WithdrawModal from "../WithdrawModal/WithdrawModal";

// নিচের লাইনে lucide-center এর বদলে lucide-react হবে
import { 
  Wallet, 
  ArrowUpCircle, 
  User as UserIcon, 
  BarChart3, 
  Code2, 
  LogOut, 
  Play, 
  LayoutGrid, 
  Trophy, 
  Headphones 
} from "lucide-react"; 

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Withdraw Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const whatsappNumber = "8801749684030";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello, I need help with the tournament app.`;

  const userData = user || {
    name: "Guest User",
    balance: 0,
    matchesPlayed: 0,
    won: 0
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleWithdrawRequest = (data) => {
    console.log("Withdraw Data:", data);
    alert(`Request Sent: ${data.amount} BDT via ${data.selectedMethod}`);
    setIsWithdrawOpen(false);
  };

  return (
    <div className="bg-[#f0f4f9] min-h-screen pb-24 font-sans text-gray-800 relative">
      
      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        availableBalance={userData.balance} 
        onWithdraw={handleWithdrawRequest}
      />

      {/* প্রোফাইল হেডার */}
      <div className="bg-gradient-to-b from-[#4facfe] to-[#00f2fe] p-8 pb-12 flex flex-col items-center rounded-b-[40px] shadow-lg">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-yellow-400 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
             {userData.avatar ? (
               <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <UserIcon size={50} className="text-white" />
             )}
          </div>
        </div>
        <h2 className="text-white text-xl font-bold mb-6 tracking-wide">{userData.name}</h2>
        <div className="flex justify-between w-full max-w-sm px-4">
          <div className="text-center">
            <p className="text-white font-black text-xl">{userData.matchesPlayed || 0}</p>
            <p className="text-white/80 text-[10px] uppercase font-bold">Played</p>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-3xl">{userData.balance || 0}</p>
            <p className="text-white/80 text-xs font-bold">BDT</p>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-xl">{userData.won || 0}</p>
            <p className="text-white/80 text-[10px] uppercase font-bold">Won</p>
          </div>
        </div>
      </div>

      {/* মেনু লিস্ট */}
      <div className="mt-6 px-4 space-y-2">
        <MenuItem icon={<Wallet className="text-blue-500" />} title="Wallet" onClick={() => navigate("/wallet")} />
        <MenuItem icon={<ArrowUpCircle className="text-blue-500" />} title="Withdraw" onClick={() => setIsWithdrawOpen(true)} />
        <MenuItem icon={<UserIcon className="text-blue-500" />} title="My Profile" />
        <MenuItem icon={<BarChart3 className="text-blue-500" />} title="Top Players" />
      </div>

      {/* Logout */}
      <div className="p-6">
        <button onClick={handleLogout} className="w-full bg-[#4facfe] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* WhatsApp Help */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-24 right-6 bg-white p-4 rounded-3xl shadow-2xl border-2 border-green-500">
        <Headphones size={30} className="text-green-500" />
      </a>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 z-50">
        <NavIcon icon={<Play size={22} />} label="Play" onClick={() => navigate("/")} />
        <NavIcon icon={<LayoutGrid size={22} />} label="Matches" />
        <NavIcon icon={<Trophy size={22} />} label="Results" />
        <NavIcon icon={<UserIcon size={22} />} label="Profile" active />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, title, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm cursor-pointer transition-all border-b border-gray-100 mb-1">
    <div className="flex items-center gap-5">
      <span className="bg-blue-50 p-2 rounded-lg">{icon}</span>
      <span className="text-md font-semibold text-gray-700">{title}</span>
    </div>
  </div>
);

const NavIcon = ({ icon, label, onClick, active = false }) => (
  <div onClick={onClick} className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-blue-500' : 'text-gray-400'}`}>
    <div className={`${active ? 'bg-blue-100 p-2 rounded-2xl px-5' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold">{label}</span>
  </div>
);

export default Profile;