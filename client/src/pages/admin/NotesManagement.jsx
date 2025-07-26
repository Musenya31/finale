import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const NotesManagement = () => {
  const { auth } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notes', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err.response?.data || err.message);
      }
    };

    if (auth?.token) fetchNotes();
  }, [auth]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notes Management</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesManagement;
