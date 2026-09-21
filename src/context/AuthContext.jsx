import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoredUsers, 
  saveUserToStore, 
  getStoredCurrentUser, 
  setStoredCurrentUser, 
  updateUserInStore 
} from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    const activeUser = getStoredCurrentUser();
    if (activeUser) {
      setUser(activeUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const sessionUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role || 'Admin',
      createdAt: matchedUser.createdAt
    };

    setUser(sessionUser);
    setStoredCurrentUser(sessionUser);
    return sessionUser;
  };

  const register = ({ name, email, password, role = 'Admin' }) => {
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      role: role || 'Admin',
      createdAt: new Date().toISOString()
    };

    saveUserToStore(newUser);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    setUser(sessionUser);
    setStoredCurrentUser(sessionUser);
    return sessionUser;
  };

  const resetPassword = (email, newPassword) => {
    const success = updateUserInStore(email, newPassword);
    if (!success) {
      throw new Error('No account found with this email address.');
    }
    return true;
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    setStoredCurrentUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    setStoredCurrentUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    resetPassword,
    switchRole,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
