import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';


const ShiftCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const fetchShifts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/shifts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const colorMap = {
          morning: '#60a5fa',
          afternoon: '#facc15',
          night: '#f87171',
        };

        const formatted = res.data.map((shift) => ({
          id: shift._id,
          title: `${shift.nurse.name} - ${shift.shiftType}`,
          start: shift.date,
          backgroundColor: colorMap[shift.shiftType],
          borderColor: colorMap[shift.shiftType],
          extendedProps: {
            nurseName: shift.nurse.name,
            shiftType: shift.shiftType,
            date: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
            ward: shift.ward,
          },
        }));

        setEvents(formatted);
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    fetchShifts();
  }, [token]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
  };

  // Get upcoming shifts for the upcoming shifts section
  const upcomingShifts = events.slice(0, 5); // Display the first 5 upcoming shifts

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Nurse Shift Calendar</h1>
          <p className="text-gray-600 text-sm mt-1">Click on a shift to view its details.</p>
        </header>

        <div className="flex gap-4">
          {/* Calendar Section */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
           <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events}
  eventClick={handleEventClick}
  height="auto"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth',
  }}
  eventDisplay="block"
  eventContent={(arg) => {
    return (
      <div
        style={{
          backgroundColor: arg.event.backgroundColor,
          border: `1px solid ${arg.event.borderColor}`,
          padding: '2px 4px',
          borderRadius: '4px',
          color: 'white',
          fontSize: '0.85rem',
          fontWeight: 500,
        }}
      >
        {arg.event.title}
      </div>
    );
  }}
/>

          </div>

          {/* Right Side Section for Legend and Shift Details */}
          <div className="w-80 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Legend</h2>
            <Legend color="bg-blue-400" label="Morning Shift" />
            <Legend color="bg-yellow-400" label="Afternoon Shift" />
            <Legend color="bg-red-400" label="Night Shift" />

            <h2 className="text-xl font-bold mt-6 mb-4">Upcoming Shifts</h2>
            <ul className="space-y-2">
              {upcomingShifts.map((event) => (
                <li key={event.id} className="p-2 bg-gray-100 rounded-md">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">{new Date(event.start).toDateString()}</p>
                </li>
              ))}
            </ul>

            {selectedEvent && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-blue-700 mb-2">
                  {selectedEvent.nurseName}
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Type:</strong> {selectedEvent.shiftType}</p>
                  <p><strong>Date:</strong> {new Date(selectedEvent.date).toDateString()}</p>
                  <p><strong>Start:</strong> {selectedEvent.startTime}</p>
                  <p><strong>End:</strong> {selectedEvent.endTime}</p>
                  {selectedEvent.ward && <p><strong>Ward:</strong> {selectedEvent.ward}</p>}
                </div>
                <div className="text-right mt-4">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded ${color}`}></span>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

export default ShiftCalendar;
