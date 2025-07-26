import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export const AuthContext = React.createContext();

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    return token ? { token, role, name } : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [auth]);

  const logout = () => {
    setAuth(null);
    localStorage.clear();
    navigate('/login');
  };
  

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      <Routes>
        <Route path="/login" element={auth ? <Navigate to="/" /> : <Login />} />
        <Route path="/*" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </AuthContext.Provider>
  );
}