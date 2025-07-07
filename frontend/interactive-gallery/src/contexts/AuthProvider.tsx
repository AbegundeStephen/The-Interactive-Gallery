import React, { useState } from "react";
import type { User } from "../types";
import { AuthContext } from "./AuthContext";
import ApiService from "../services/ApiService";

// Auth Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiService = new ApiService();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      console.log("user...", response);
      setUser(response.user);
    } catch (error) {
      console.error(error);
      setError("Login failed");
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const response = await apiService.register(username, email, password);
      setUser(response.user);
    } catch (error) {
      console.error(error);
      setError("Registration failed");
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
