import React from 'react';
import UserManagement from './UserManagement';
import ShiftManagement from './ShiftManagement';
import NotesManagement from './NotesManagement';

export default function AdminDashboard() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <UserManagement />
      <ShiftManagement />
      <NotesManagement />
    </div>
  );
}