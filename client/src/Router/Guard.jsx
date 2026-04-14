 import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";

export function PrivateRoute({ children }) {
  const auth = useContext(AuthContext);
  if (!auth || auth.loading) {
    return <div className="p-10 text-white bg-gray-900 min-h-screen font-bold">Loading...</div>;
  }
  return auth.user ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const auth = useContext(AuthContext);
  if (!auth || auth.loading) {
    return <div className="p-10 text-white bg-gray-900 min-h-screen font-bold">Loading...</div>;
  }
  return auth.user && auth.user.role === "admin" ? children : <Navigate to="/" replace />;
}