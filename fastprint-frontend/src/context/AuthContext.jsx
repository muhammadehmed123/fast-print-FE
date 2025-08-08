import React, { createContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user and token from localStorage to persist login across refreshes
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("accessToken") || null);

  // Signup function
  const signup = async (formData) => {
    return authService.register(formData);
  };

  // Login function
  const login = async (formData) => {
    const res = await authService.login(formData);
    setUser(res.user);
    setToken(res.access);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("accessToken", res.access);
    return res.user; // Return user data so frontend can check is_admin and redirect accordingly
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  // Optional: Sync auth state across tabs/windows
  useEffect(() => {
    const syncAuth = () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("accessToken");
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setToken(savedToken || null);
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
