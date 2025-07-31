import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const NotesManagement = () => {
  const { auth } = useAuth();
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setNotes(res.data);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchNotes();
  }, [auth]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/notes',
        formData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setFormData({ content: '' });
      fetchNotes();
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${editingNote._id}`,
        { content: editingNote.content },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">📝 Notes Management</h2>

      {/* Note Creation */}
      <form onSubmit={handleCreate} className="mb-6">
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ content: e.target.value })}
          placeholder="Write a note..."
          className="w-full border p-3 rounded mb-2"
          rows="3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
        >
          Add Note
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Notes List */}
      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition"
            >
              <p className="text-gray-800 mb-2">{note.content}</p>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>{note.author?.name || 'Unknown Author'}</span>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditingNote(note)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded shadow-sm transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow-sm transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Note</h3>
            <form onSubmit={handleEdit}>
              <textarea
                value={editingNote.content}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, content: e.target.value })
                }
                className="w-full border p-3 rounded mb-3"
                rows="4"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManagement;
