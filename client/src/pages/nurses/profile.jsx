import React, { useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if(form.newPassword !== form.confirmNewPassword){
      setError('New passwords do not match');
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/users/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setSuccess('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      {error && <p className="mb-3 text-red-600">{error}</p>}
      {success && <p className="mb-3 text-green-600">{success}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={e => setForm({ ...form, currentPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={e => setForm({ ...form, newPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={form.confirmNewPassword}
          onChange={e => setForm({ ...form, confirmNewPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Change Password
        </button>
      </form>
    </section>
  );
}