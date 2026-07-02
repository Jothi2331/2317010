import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const Context = createContext();
export const useNotifications = () => useContext(Context);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewed, setViewed] = useState(() => JSON.parse(localStorage.getItem('viewed') || '[]'));

  const fetchNotifications = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://4.224.186.213/evaluation-service/notifications', { params });
      setNotifications(res.data.notifications || []);
    } catch (e) {
      setError('Failed to fetch: ' + e.message);
      // Mock data for testing
      setNotifications([
        { ID: '1', Type: 'Placement', Message: 'Google hiring', Timestamp: new Date().toISOString() },
        { ID: '2', Type: 'Result', Message: 'Exam results out', Timestamp: new Date(Date.now() - 3600000).toISOString() },
        { ID: '3', Type: 'Event', Message: 'Tech fest next week', Timestamp: new Date(Date.now() - 7200000).toISOString() },
      ]);
    }
    setLoading(false);
  };

  const markAsViewed = (id) => {
    if (!viewed.includes(id)) {
      const n = [...viewed, id];
      setViewed(n);
      localStorage.setItem('viewed', JSON.stringify(n));
    }
  };

  const isViewed = (id) => viewed.includes(id);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Context.Provider value={{ 
      notifications, loading, error, fetchNotifications, markAsViewed, isViewed 
    }}>
      {children}
    </Context.Provider>
  );
};