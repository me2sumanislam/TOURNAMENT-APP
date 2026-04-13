 import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ এটি অ্যাপ ক্র্যাশ হওয়া আটকাবে

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false); // ✅ ডাটা চেক শেষ
      }
    };
    checkAuth();
  }, []);

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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };