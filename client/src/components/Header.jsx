import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { auth, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (auth.role === 'nurse') {
      fetchNotifications();
    }
  }, [auth]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data);
    } catch {
      // handle error if needed
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch {
      // handle error if needed
    }
  };

  return (
    <header className="bg-white flex justify-between items-center p-4 shadow sticky top-0 z-10">
      <h1 className="text-xl font-bold">
        Nurse Shift App - {auth.name} ({auth.role})
      </h1>

      <div className="flex items-center space-x-4">
        {auth.role === 'nurse' && (
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="relative focus:outline-none">
              <BellIcon className="h-6 w-6 text-gray-700" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded shadow-lg max-h-72 overflow-auto z-20">
                {notifications.length === 0 ? (
                  <p className="p-3 text-gray-500">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className="p-3 hover:bg-gray-100 flex justify-between items-center">
                      <p className="text-sm">{n.message}</p>
                      <button onClick={() => markRead(n._id)} className="text-blue-600 text-xs ml-2">
                        Mark read
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        <button onClick={logout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
