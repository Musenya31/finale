import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newShift, setNewShift] = useState({
    nurse: '',
    date: '',
    shiftType: '',
    startTime: '',
    endTime: '',
  });

  const [commentText, setCommentText] = useState({});
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [usersRes, shiftsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/shifts', {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
        setUsers(usersRes.data);
        setShifts(shiftsRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please check your authentication.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewShift({ ...newShift, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const existingShift = shifts.find(
        shift =>
          shift.nurse === newShift.nurse &&
          new Date(shift.date).toDateString() === new Date(newShift.date).toDateString()
      );
      if (!isEditing && existingShift) {
        setError('A shift already exists for this nurse on the selected date.');
        return;
      }

      if (isEditing) {
        const res = await axios.put(
          `http://localhost:5000/api/shifts/${selectedShiftId}`,
          newShift,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShifts(shifts.map(s => (s._id === selectedShiftId ? res.data : s)));
        setSuccessMessage('Shift updated successfully!');
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/shifts',
          newShift,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShifts([...shifts, res.data]);
        setSuccessMessage('Shift created successfully!');
      }

      setNewShift({ nurse: '', date: '', shiftType: '', startTime: '', endTime: '' });
      setIsEditing(false);
      setSelectedShiftId(null);
      setError('');
    } catch (err) {
      setError('Failed to create/update shift. Please check your input.');
    }
  };

 const handleCommentSubmit = async (e, shiftId) => {
  e.preventDefault();
  const comment = commentText[shiftId];
  const author = localStorage.getItem('userId'); // Make sure this exists
  if (!comment || !author) {
    setError('Comment or author is missing.');
    return;
  }

  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(
      `http://localhost:5000/api/shifts/${shiftId}/comments`,
      { comment, author },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShifts(shifts.map(s => (s._id === shiftId ? res.data : s)));
    setCommentText({ ...commentText, [shiftId]: '' });
    setError('');
  } catch (err) {
    setError('Failed to add comment. Please try again.');
  }
};

  const handleEditShift = (shift) => {
    setNewShift({
      nurse: shift.nurse,
      date: shift.date,
      shiftType: shift.shiftType,
      startTime: shift.startTime,
      endTime: shift.endTime,
    });
    setSelectedShiftId(shift._id);
    setIsEditing(true);
    setError('');
  };

  const handleDeleteShift = async (shiftId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/shifts/${shiftId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(shifts.filter(shift => shift._id !== shiftId));
      setSuccessMessage('Shift deleted successfully!');
    } catch (err) {
      setError('Failed to delete shift. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Shift Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Shift' : 'Create New Shift'}</h2>
        <div>
          <label className="block mb-1 font-semibold">Nurse</label>
          <select
            name="nurse"
            value={newShift.nurse}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Nurse</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={newShift.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Shift Type</label>
          <select
            name="shiftType"
            value={newShift.shiftType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Shift</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={newShift.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">End Time</label>
          <input
            type="time"
            name="endTime"
            value={newShift.endTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {isEditing ? 'Update Shift' : 'Create Shift'}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-3 text-center">All Shifts</h2>
      <ul className="space-y-4">
        {shifts.map((shift) => (
          <li key={shift._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <div>Nurse: <strong>{users.find(u => u._id === shift.nurse)?.name || 'Unknown'}</strong></div>
            <div>Date: {new Date(shift.date).toLocaleDateString()}</div>
            <div>Shift Type: {shift.shiftType}</div>
            <div>Start: {shift.startTime}</div>
            <div>End: {shift.endTime}</div>

            <div className="mt-2">
              <strong>Comments:</strong>
              <ul className="list-disc ml-5 text-sm">
                {shift.comments.map((c) => (
                  <li key={c._id}>
                    {c.comment} - <span className="text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <form onSubmit={(e) => handleCommentSubmit(e, shift._id)} className="mt-2">
                <input
                  type="text"
                  value={commentText[shift._id] || ''}
                  onChange={(e) => setCommentText({ ...commentText, [shift._id]: e.target.value })}
                  placeholder="Add comment"
                  className="border px-3 py-1 rounded w-2/3 mr-2"
                />
                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Submit
                </button>
              </form>
            </div>

            <div className="mt-3 flex justify-between">
              <button onClick={() => handleEditShift(shift)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDeleteShift(shift._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftManagement;
