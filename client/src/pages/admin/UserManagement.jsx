import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    nurseId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.username || !form.password || !form.role) {
      setError('All fields except nurseId are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(API, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({
        name: '',
        email: '',
        username: '',
        password: '',
        role: '',
        nurseId: ''
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="nurse">Nurse</option>
        </select>
        <input
          type="text"
          name="nurseId"
          placeholder="Nurse ID (optional)"
          value={form.nurseId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add User
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <h3 className="text-xl font-semibold mt-6">Existing Users</h3>
      <ul className="mt-3 space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border p-3 rounded shadow-sm">
            <p><strong>{user.name}</strong> ({user.role})</p>
            <p>{user.email} — <span className="italic">{user.username}</span></p>
            {user.nurseId && <p className="text-sm text-gray-600">Nurse ID: {user.nurseId}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
