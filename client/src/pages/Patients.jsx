import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const Patients = () => {
  const { auth } = useAuth();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    age: '',
    contact: '',
    address: '',
    medicalHistory: '',
  });

  const [editingId, setEditingId] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchPatients();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/patients/${editingId}`, form, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/patients', form, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      }
      setForm({
        firstName: '', lastName: '', gender: 'Male', age: '', contact: '', address: '', medicalHistory: '',
      });
      setEditingId(null);
      fetchPatients();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditingId(patient._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchPatients();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Patients Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input input-bordered" required />
          <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input input-bordered" required />
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input input-bordered">
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input input-bordered" required />
          <input type="text" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="input input-bordered" />
          <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input input-bordered" />
        </div>
        <textarea placeholder="Medical History" value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} className="input input-bordered w-full" />
        <button className="btn btn-primary">{editingId ? 'Update' : 'Add'} Patient</button>
      </form>

      {/* List */}
      <ul className="mt-8 space-y-4">
        {patients.map((p) => (
          <li key={p._id} className="bg-gray-100 p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h4 className="font-bold">{p.firstName} {p.lastName}</h4>
              <p>Gender: {p.gender} | Age: {p.age}</p>
              <p>Contact: {p.contact} | Address: {p.address}</p>
              <p>Medical History: {p.medicalHistory}</p>
            </div>
            <div className="mt-2 md:mt-0 flex gap-2">
              <button onClick={() => handleEdit(p)} className="btn btn-sm btn-info">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-error">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Patients;
