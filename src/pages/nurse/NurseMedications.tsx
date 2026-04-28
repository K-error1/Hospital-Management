import { useState, useEffect } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Patient, Prescription } from '../../types';

export default function NurseMedications() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, prData] = await Promise.all([api.fetchPatients(), api.fetchPrescriptions()]);
        setPatients(pData);
        setPrescriptions(prData);
      } catch (err) {
        console.error('Error fetching medication data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Medications...</p></div>;
  }

  const myPatients = patients.filter(p => p.assignedNurse === user?.id);

  const medicationSchedule = myPatients.flatMap(patient => {
    const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
    return patientPrescriptions.flatMap(presc =>
      presc.medications.map(med => ({
        patientName: patient.name,
        room: patient.room || 'N/A',
        medication: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        status: 'Pending' as string,
      }))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Medication Tracking</h2>
        <p className="text-gray-500 mt-1">Track and administer patient medications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-700">{medicationSchedule.filter(m => m.status === 'Pending').length}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{medicationSchedule.filter(m => m.status === 'Administered').length}</p>
          <p className="text-sm text-green-600">Administered</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{medicationSchedule.length}</p>
          <p className="text-sm text-blue-600">Total Medications</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Medication Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Room</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Medication</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dosage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Frequency</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {medicationSchedule.map((med, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{med.patientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{med.room}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">💊 {med.medication}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{med.dosage}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{med.frequency}</td>
                  <td className="px-4 py-3"><StatusBadge status={med.status === 'Administered' ? 'Completed' : 'Pending'} /></td>
                  <td className="px-4 py-3">
                    {med.status === 'Pending' && (
                      <button className="px-3 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium hover:bg-sky-200 transition-colors">
                        Mark Given
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {medicationSchedule.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No medications found for your patients</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
