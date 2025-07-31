import React from 'react';
import UserManagement from './UserManagement';
import ShiftManagement from './ShiftManagement';
import NotesManagement from './NotesManagement';

export default function AdminDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">User  Management</h2>
            <UserManagement />
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Shift Management</h2>
            <ShiftManagement />
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Notes Management</h2>
            <NotesManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
