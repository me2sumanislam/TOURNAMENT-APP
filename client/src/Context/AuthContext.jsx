 import { createContext, useEffect, useState } from "react";

// ১. কনটেক্সট তৈরি করুন
const AuthContext = createContext();

// ২. প্রোভাইডার কম্পোনেন্ট
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ৩. একসাথে এক্সপোর্ট করুন (Vite Fast Refresh এর জন্য এটিই বেস্ট)
export { AuthContext, AuthProvider };