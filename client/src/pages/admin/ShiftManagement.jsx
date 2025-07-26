import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newShift, setNewShift] = useState({
    user: '',
    startTime: '',
    endTime: '',
    comment: '',
  });

  const fetchShifts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shifts');
      setShifts(res.data);
    } catch (err) {
      console.error('Failed to fetch shifts:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data.users || []); // Ensure it's always an array
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]); // fallback to empty array to avoid .map error
    }
  };

  useEffect(() => {
    fetchShifts();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewShift({ ...newShift, [e.target.name]: e.target.value });
  };

  const handleCreateShift = async () => {
    try {
      await axios.post('http://localhost:5000/api/shifts', newShift);
      fetchShifts();
      setNewShift({ user: '', startTime: '', endTime: '', comment: '' });
    } catch (err) {
      console.error('Failed to create shift:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shift Management</h2>

      <div className="mb-6 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Create New Shift</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="user"
            value={newShift.user}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Nurse</option>
            {Array.isArray(users) && users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="startTime"
            value={newShift.startTime}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={newShift.endTime}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="comment"
            value={newShift.comment}
            onChange={handleChange}
            placeholder="Comment"
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreateShift}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Shift
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Shifts</h3>
        {shifts.length === 0 ? (
          <p>No shifts available.</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Nurse</th>
                <th className="border px-4 py-2">Start Time</th>
                <th className="border px-4 py-2">End Time</th>
                <th className="border px-4 py-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift._id}>
                  <td className="border px-4 py-2">{shift.user?.name || 'Unknown'}</td>
                  <td className="border px-4 py-2">{new Date(shift.startTime).toLocaleString()}</td>
                  <td className="border px-4 py-2">{new Date(shift.endTime).toLocaleString()}</td>
                  <td className="border px-4 py-2">{shift.comment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
