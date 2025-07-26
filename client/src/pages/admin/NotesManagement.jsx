import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

export default function NotesManagement() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Edit modal states
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editError, setEditError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Delete modal states
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Load notes from backend
  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/notes');
      setNotes(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setError('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Add new note
  const submitNote = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!content.trim()) {
      setError('Note content cannot be empty.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/notes', { content });
      setSuccess('Note added successfully.');
      setContent('');
      loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note.');
    }
  };

  // Open edit modal and populate content
  const openEdit = (note) => {
    setEditId(note._id);
    setEditContent(note.content);
    setEditError(null);
    setEditDialogOpen(true);
  };

  // Submit edit form
  const submitEdit = async (e) => {
    e.preventDefault();
    setEditError(null);

    if (!editContent.trim()) {
      setEditError('Note content cannot be empty.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/notes/${editId}`, { content: editContent });
      setEditDialogOpen(false);
      loadNotes();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update note.');
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  // Execute delete
  const deleteNote = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${deleteId}`);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      loadNotes();
    } catch {
      setError('Failed to delete note.');
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <section className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Notes Management</h2>

      <form onSubmit={submitNote} className="mb-6 space-y-3">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <textarea
          rows={4}
          className="w-full border border-gray-300 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Note
        </button>
      </form>

      <div>
        <h3 className="font-semibold mb-3">All Notes</h3>
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <li
                key={note._id}
                className="border rounded p-3 bg-gray-50 flex flex-col sm:flex-row sm:justify-between"
              >
                <div>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    By <span className="font-semibold">{note.author?.name || 'Unknown'}</span> on{' '}
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex space-x-3 items-start">
                  <button
                    onClick={() => openEdit(note)}
                    className="text-blue-600 hover:underline text-sm"
                    aria-label={`Edit note by ${note.author?.name || 'Unknown'}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(note._id)}
                    className="text-red-600 hover:underline text-sm"
                    aria-label={`Delete note by ${note.author?.name || 'Unknown'}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Note Modal */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        className="fixed z-40 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded shadow-lg max-w-md p-6 w-full">
            <Dialog.Title className="font-bold text-lg mb-4">Edit Note</Dialog.Title>

            {editError && <p className="text-red-600 mb-3">{editError}</p>}

            <form onSubmit={submitEdit} className="space-y-4">
              <textarea
                rows={6}
                className="w-full border border-gray-300 p-2 rounded"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded shadow-lg max-w-sm p-6">
            <Dialog.Title className="font-bold text-lg mb-4">Confirm Delete</Dialog.Title>
            <p>Are you sure you want to delete this note?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteNote}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}