// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../constants/config";
import { clearCartStorage } from "../contexts/CartContext"; // ✅ import helper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch the currently logged-in user on app load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${server}/api/v1/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // ✅ Login
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${server}/api/v1/users/login`, credentials, {
        withCredentials: true,
      });
      setUser(res.data.data.loggedInUser || res.data.data);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid username or password"
      );
      throw error;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await axios.get(`${server}/api/v1/users/logout`, {
        withCredentials: true,
      });
      setUser(null);
      clearCartStorage(); // ✅ safely clears localStorage
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed. Try again!");
    }
  };

  // ✅ Update Account
  const updateAccount = async (details) => {
    try {
      const res = await axios.post(
        `${server}/api/v1/users/update-account-details`,
        details,
        { withCredentials: true }
      );
      setUser(res.data.data);
      toast.success("Account updated!");
    } catch {
      toast.error("Failed to update account details.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
