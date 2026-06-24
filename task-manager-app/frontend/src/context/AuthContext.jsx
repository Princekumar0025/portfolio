import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
