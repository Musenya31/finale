import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'nurse', name: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('http://localhost:5000/api/users', form);
      setSuccess('User created');
      setForm({ username: '', password: '', role: 'nurse', name: '' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      <form onSubmit={submit} className="mb-6 max-w-md space-y-3 bg-white p-6 rounded shadow">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value="nurse">Nurse</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </button>
      </form>

      <div className="bg-white p-6 rounded shadow max-w-5xl">
        <h3 className="font-semibold mb-3">All Users</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="odd:bg-gray-50">
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.username}</td>
                <td className="border p-2 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}