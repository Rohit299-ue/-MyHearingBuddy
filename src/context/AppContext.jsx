import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    detectionMode: 'optimized',
    detectionSpeed: 50,
    backendUrl: 'http://localhost:5000',
    darkMode: false,
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    const savedHistory = localStorage.getItem('history');
    const savedSettings = localStorage.getItem('settings');

    if (savedAuth) setIsAuthenticated(JSON.parse(savedAuth));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const addHistory = (item) => {
    const newHistory = [{ ...item, timestamp: new Date().toISOString() }, ...history];
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('history');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('settings', JSON.stringify(updated));
  };

  const value = {
    isAuthenticated,
    user,
    history,
    settings,
    login,
    logout,
    addHistory,
    clearHistory,
    updateSettings,
    updateUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
