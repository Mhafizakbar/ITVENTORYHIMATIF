import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for existing user data
      const storedUser = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      if (storedUser && isLoggedIn === 'true') {
        const userData = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', userData);
        setUser(userData);
      } else {
        console.log('No valid user data in localStorage');
        setUser(null);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, role) => {
    const userWithRole = { ...userData, role };
    setUser(userWithRole);

    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(userWithRole));
    localStorage.setItem('isLoggedIn', 'true');

    console.log('User logged in and saved to localStorage:', userWithRole);
  };

  const logout = async () => {
    try {
      // Try logout endpoint, but don't fail if it doesn't exist
      const response = await fetch('https://pweb-be-production.up.railway.app/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      // If 404, try alternative endpoint
      if (!response.ok && response.status === 404) {
        await fetch('https://pweb-be-production.up.railway.app/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      // Logout should work even if server endpoint fails
      console.log('Logout request failed, proceeding with local logout:', error);
    }

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');

    setUser(null);
    console.log('User logged out and localStorage cleared');
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isLoggedIn,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
