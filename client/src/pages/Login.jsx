import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../index.css';

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      setAuth({ token: res.data.token, role: res.data.role, name: res.data.name });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-blue-500 p-5">
      <form onSubmit={submit} className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Nurse Shift Login</h1>
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          className="w-full border p-3 mb-4 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full border p-3 mb-6 rounded"
          required
        />
        <button 
          type="submit" 
          className={`bg-blue-600 text-white w-full py-2 rounded ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
