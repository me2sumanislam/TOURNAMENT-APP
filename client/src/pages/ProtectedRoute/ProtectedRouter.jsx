 import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // যদি ইউজার লগইন করা না থাকে অথবা সে অ্যাডমিন না হয়, তবে তাকে হোমে পাঠিয়ে দিবে
  if (!user || user.role !== "admin") {
    alert("অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন এখানে ঢুকতে পারবে।");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;