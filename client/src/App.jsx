import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RoutesWrapper />
    </AuthProvider>
  );
}

function RoutesWrapper() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
      <Route path="/*" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}
