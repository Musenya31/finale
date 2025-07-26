import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import NurseDashboard from './nurses/NurseDashboard';
import Header from '../components/Header';

export default function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="p-6 flex-grow max-w-7xl mx-auto">
        {auth.role === 'admin' ? <AdminDashboard /> : <NurseDashboard />}
      </main>
    </div>
  );
}
