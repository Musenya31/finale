import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PatientForm = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [patient, setPatient] = useState(null);
  const [handover, setHandover] = useState({
    shiftType: 'Morning',
    notes: '',
    observations: '',
    medicationGiven: '',
    vitals: {
      temperature: '',
      bloodPressure: '',
      pulse: '',
    },
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setPatient(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPatient();
  }, [id, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/handovers', {
        ...handover,
        patientId: id,
      }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      alert('Handover submitted!');
      setHandover({
        shiftType: 'Morning',
        notes: '',
        observations: '',
        medicationGiven: '',
        vitals: {
          temperature: '',
          bloodPressure: '',
          pulse: '',
        },
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!patient) return <p>Loading patient...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Patient: {patient.firstName} {patient.lastName}</h2>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Contact:</strong> {patient.contact}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <select
          value={handover.shiftType}
          onChange={(e) => setHandover({ ...handover, shiftType: e.target.value })}
          className="input input-bordered w-full"
        >
          <option>Morning</option>
          <option>Evening</option>
          <option>Night</option>
        </select>

        <textarea
          placeholder="Nurse Notes"
          value={handover.notes}
          onChange={(e) => setHandover({ ...handover, notes: e.target.value })}
          className="input input-bordered w-full"
        />

        <textarea
          placeholder="Observations"
          value={handover.observations}
          onChange={(e) => setHandover({ ...handover, observations: e.target.value })}
          className="input input-bordered w-full"
        />

        <textarea
          placeholder="Medication Given"
          value={handover.medicationGiven}
          onChange={(e) => setHandover({ ...handover, medicationGiven: e.target.value })}
          className="input input-bordered w-full"
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Temperature"
            value={handover.vitals.temperature}
            onChange={(e) => setHandover({ ...handover, vitals: { ...handover.vitals, temperature: e.target.value } })}
            className="input input-bordered"
          />
          <input
            type="text"
            placeholder="Blood Pressure"
            value={handover.vitals.bloodPressure}
            onChange={(e) => setHandover({ ...handover, vitals: { ...handover.vitals, bloodPressure: e.target.value } })}
            className="input input-bordered"
          />
          <input
            type="text"
            placeholder="Pulse"
            value={handover.vitals.pulse}
            onChange={(e) => setHandover({ ...handover, vitals: { ...handover.vitals, pulse: e.target.value } })}
            className="input input-bordered"
          />
        </div>

        <button type="submit" className="btn btn-success">Submit Handover</button>
      </form>
    </div>
  );
};

export default PatientForm;
