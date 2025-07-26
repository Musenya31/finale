import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Dialog } from '@headlessui/react';

export default function ShiftManagement() {
  const [nurses, setNurses] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ nurseId: '', date: '', shiftType: 'morning' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nurseId: '', date: '', shiftType: 'morning' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editError, setEditError] = useState(null);

  const loadNurses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setNurses(res.data.filter(u => u.role === 'nurse'));
    } catch {
      setError('Failed to load nurses');
    }
  };

  const loadShifts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shifts');
      setShifts(res.data);
    } catch {
      setError('Failed to load shifts');
    }
  };

  useEffect(() => {
    loadNurses();
    loadShifts();
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('http://localhost:5000/api/shifts', form);
      setSuccess('Shift added');
      setForm({ nurseId: '', date: '', shiftType: 'morning' });
      loadShifts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding shift');
    }
  };

  const deleteShift = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/shifts/${deleteId}`);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      loadShifts();
    } catch {
      setError('Failed to delete shift');
    }
  };

  // Open edit modal
  const openEdit = (shift) => {
    setEditId(shift._id);
    setEditForm({
      nurseId: shift.nurse._id,
      date: dayjs(shift.date).format('YYYY-MM-DD'),
      shiftType: shift.shiftType,
    });
    setEditError(null);
    setEditDialogOpen(true);
  };

  const submitEdit = async e => {
    e.preventDefault();
    setEditError(null);
    try {
      await axios.put(`http://localhost:5000/api/shifts/${editId}`, editForm);
      setEditDialogOpen(false);
      loadShifts();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update shift');
    }
  };

  // For coloring shift types in list
  const shiftColor = (type) => {
    switch (type) {
      case 'morning': return 'bg-yellow-300';
      case 'afternoon': return 'bg-blue-300';
      case 'night': return 'bg-purple-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Shift Management</h2>

      <form onSubmit={submit} className="mb-8 max-w-md space-y-3 bg-white p-6 rounded shadow">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <select
          value={form.nurseId}
          onChange={e => setForm({ ...form, nurseId: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value="" disabled>Select Nurse</option>
          {nurses.map(n => (
            <option key={n._id} value={n._id}>{n.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <select
          value={form.shiftType}
          onChange={e => setForm({ ...form, shiftType: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="night">Night</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Shift
        </button>
      </form>

      <div className="bg-white p-6 rounded shadow max-w-4xl overflow-x-auto">
        <h3 className="font-semibold mb-3">All Shifts</h3>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Nurse</th>
              <th className="border p-2">Shift Type</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map(s => (
              <tr key={s._id} className="odd:bg-gray-50">
                <td className="border p-2">{dayjs(s.date).format('YYYY-MM-DD')}</td>
                <td className="border p-2">{s.nurse.name}</td>
                <td className={`border p-2 capitalize font-semibold ${shiftColor(s.shiftType)}`}>
                  {s.shiftType}
                </td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline text-sm">
                    Edit
                  </button>
                  <button onClick={() => { setDeleteId(s._id); setDeleteDialogOpen(true); }} className="text-red-600 hover:underline text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {shifts.length === 0 && (
              <tr><td colSpan={4} className="text-center p-4">No shifts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} className="fixed z-30 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded shadow-lg max-w-sm p-6">
            <Dialog.Title className="font-bold text-lg mb-4">Confirm Delete</Dialog.Title>
            <p>Are you sure you want to delete this shift?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setDeleteDialogOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={deleteShift} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Shift Modal */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} className="fixed z-40 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded shadow-lg max-w-md p-6">
            <Dialog.Title className="font-bold text-lg mb-4">Edit Shift</Dialog.Title>

            {editError && <p className="text-red-600 mb-3">{editError}</p>}

            <form onSubmit={submitEdit} className="space-y-4">
              <select
                value={editForm.nurseId}
                onChange={e => setEditForm({ ...editForm, nurseId: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="" disabled>Select Nurse</option>
                {nurses.map(n => (
                  <option key={n._id} value={n._id}>{n.name}</option>
                ))}
              </select>

              <input
                type="date"
                value={editForm.date}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />

              <select
                value={editForm.shiftType}
                onChange={e => setEditForm({ ...editForm, shiftType: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
              </select>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setEditDialogOpen(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}