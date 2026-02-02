import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Run ONLY once on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authAPI.getMe();

      if (data) {
        setUser(data);
      } else {
        setUser(null); // logged out
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await authAPI.login(email, password);
      const userData = await authAPI.getMe();
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

const signup = async (name, email, password) => {
  try {
    await authAPI.signup(name, email, password);

    const userData = await authAPI.getMe();
    setUser(userData);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};



  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null); // ✅ immediately unauth
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
