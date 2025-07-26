import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function NurseDashboard() {
  const [shifts, setShifts] = useState([]);
  const [commentingShiftId, setCommentingShiftId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadShifts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shifts');
      setShifts(res.data.sort((a,b) => new Date(a.date) - new Date(b.date)));
    } catch {
      setError('Failed to load shifts');
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const submitComment = async (shiftId) => {
    if (!commentText.trim()) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`http://localhost:5000/api/shifts/${shiftId}/comments`, { comment: commentText });
      setSuccess('Comment added');
      setCommentText('');
      setCommentingShiftId(null);
      loadShifts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const upcomingShifts = shifts.filter(s => new Date(s.date) >= new Date());
  const pastShifts = shifts.filter(s => new Date(s.date) < new Date());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <section>
        <h2 className="text-2xl font-semibold mb-3">Upcoming Shifts</h2>
        {upcomingShifts.length === 0 ? (
          <p>No upcoming shifts.</p>
        ) : (
          upcomingShifts.map(shift => (
            <div key={shift._id} className="bg-white p-4 rounded shadow mb-3">
              <p>
                <strong>Date:</strong> {dayjs(shift.date).format('YYYY-MM-DD')} &nbsp;
                <strong>Shift:</strong> {shift.shiftType}
              </p>

              <div className="mt-2">
                <strong>Comments:</strong>
                {shift.comments?.length === 0 && <p className="text-gray-500">No comments</p>}
                <ul className="list-disc pl-5 space-y-1">
                  {shift.comments.map(c => (
                    <li key={c._id}>
                      <span className="font-semibold">{c.author?.name || 'Unknown'}:</span> {c.comment} 
                      <span className="text-xs text-gray-400 ml-2">({dayjs(c.createdAt).format('MM/DD HH:mm')})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {commentingShiftId === shift._id ? (
                <div className="mt-3 flex space-x-2">
                  <input
                    type="text"
                    className="border p-2 flex-grow rounded"
                    placeholder="Add comment"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  />
                  <button onClick={() => submitComment(shift._id)} className="bg-blue-600 text-white px-3 rounded">
                    Submit
                  </button>
                  <button onClick={() => setCommentingShiftId(null)} className="px-3 rounded border border-gray-300">
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="mt-3 text-sm text-blue-600 hover:underline" onClick={() => setCommentingShiftId(shift._id)}>
                  Add Comment
                </button>
              )}
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Past Shifts</h2>
        {pastShifts.length === 0 ? (
          <p>No past shifts.</p>
        ) : (
          pastShifts.map(shift => (
            <div key={shift._id} className="bg-white p-3 rounded shadow mb-2 text-gray-700">
              <p>
                <strong>Date:</strong> {dayjs(shift.date).format('YYYY-MM-DD')} &nbsp;
                <strong>Shift:</strong> {shift.shiftType}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}