import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import NurseShiftCalendar from "../../components/ShiftCalendar";

const NurseDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [handovers, setHandovers] = useState([]);
  const [userId, setUser Id] = useState(null); // Corrected: removed space
  const [userName, setUser Name] = useState(""); // Corrected: removed space

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser Id(decoded.id);
      setUser Name(decoded.name || decoded.fullName || ""); // fallback name
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchShifts();
      fetchPatients();
      fetchHandovers();
    }
  }, [userId]);

  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/shifts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter only this nurse’s shifts
      const filtered = res.data.filter((shift) => shift.nurse === userId);
      setShifts(filtered);
    } catch (error) {
      console.error("Error loading shifts:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Error loading patients:", err);
    }
  };

  const fetchHandovers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/handovers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter only handovers by this nurse
      const filtered = res.data.filter((handover) => handover.nurse === userId);
      setHandovers(filtered);
    } catch (err) {
      console.error("Error loading handovers:", err);
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Welcome, {userName}</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Shift Calendar</h2>
        <NurseShiftCalendar shifts={shifts} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 mt-6">Patients</h2>
        {patients.length === 0 ? (
          <p className="text-gray-600">No patients available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((patient) => (
              <div key={patient._id} className="p-4 bg-white shadow rounded">
                <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Contact:</strong> {patient.contact || "N/A"}</p>
                <p><strong>Address:</strong> {patient.address || "N/A"}</p>
                <p><strong>Medical History:</strong> {patient.medicalHistory || "N/A"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 mt-6">Shift Handovers</h2>
        {handovers.length === 0 ? (
          <p className="text-gray-600">No handovers found.</p>
        ) : (
          <ul className="space-y-3">
            {handovers.map((handover) => (
              <li key={handover._id} className="bg-white p-4 rounded shadow">
                <p><strong>Date:</strong> {new Date(handover.createdAt).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(handover.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Content:</strong> {handover.content}</p>
                <p className="text-sm text-gray-600">By: {handover.nurseName || userName}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default NurseDashboard;
