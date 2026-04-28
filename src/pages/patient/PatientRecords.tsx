import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Patient, VitalSign, Appointment, Doctor } from '../../types';

export default function PatientRecords() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, vData, aData, dData] = await Promise.all([
          api.fetchPatients(),
          api.fetchVitals(),
          api.fetchAppointments(),
          api.fetchDoctors(),
        ]);
        setPatients(pData);
        setVitalSigns(vData);
        setAppointments(aData);
        setDoctors(dData);
      } catch (err) {
        console.error('Error fetching patient records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Medical Records...</p></div>;
  }

  const patientInfo = patients.find(p => p.id === user?.id);
  const myVitals = vitalSigns.filter(v => v.patientId === user?.id).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  const myAppointments = appointments.filter(a => a.patientId === user?.id && a.status === 'Completed');
  const doctorName = patientInfo ? doctors.find(d => d.id === patientInfo.assignedDoctor)?.name : 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
        <p className="text-gray-500 mt-1">Your complete medical history</p>
      </div>

      {/* Patient Summary */}
      {patientInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Patient Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-medium">{patientInfo.name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Age / Gender</p>
              <p className="font-medium">{patientInfo.age} / {patientInfo.gender}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Blood Group</p>
              <p className="font-medium text-red-600">{patientInfo.bloodGroup}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Attending Doctor</p>
              <p className="font-medium">{doctorName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Diagnosis</p>
              <p className="font-medium">{patientInfo.diagnosis}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Admission Date</p>
              <p className="font-medium">{patientInfo.admissionDate}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium">{patientInfo.status}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Room</p>
              <p className="font-medium">{patientInfo.room || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vitals History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Vital Signs History</h3>
        </div>
        {myVitals.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No vital records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date &amp; Time</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Temp (°C)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Blood Pressure</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Heart Rate</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">SpO2</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myVitals.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium text-gray-800">{v.date}</p>
                      <p className="text-xs text-gray-500">{v.time}</p>
                    </td>
                    <td className={`px-4 py-3 text-sm text-center font-semibold ${v.temperature > 37.2 ? 'text-red-600' : 'text-gray-800'}`}>{v.temperature}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold">{v.bloodPressure}</td>
                    <td className={`px-4 py-3 text-sm text-center font-semibold ${v.heartRate > 90 ? 'text-orange-600' : 'text-gray-800'}`}>{v.heartRate} bpm</td>
                    <td className={`px-4 py-3 text-sm text-center font-semibold ${v.oxygenLevel < 95 ? 'text-red-600' : 'text-green-600'}`}>{v.oxygenLevel}%</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{v.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visit History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Visit History</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {myAppointments.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No completed visits</div>
          ) : (
            myAppointments.map(apt => (
              <div key={apt.id} className="p-4 hover:bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{apt.doctorName}</p>
                    <p className="text-sm text-gray-500">{apt.type} • {apt.date} at {apt.time}</p>
                    {apt.notes && <p className="text-sm text-gray-500 mt-1">📝 {apt.notes}</p>}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Completed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
