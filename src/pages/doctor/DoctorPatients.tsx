import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { patients, vitalSigns, prescriptions } from '../../data/mockData';
import { Patient } from '../../types';

export default function DoctorPatients() {
  const { user } = useAuth();
  const myPatients = patients.filter(p => p.assignedDoctor === user?.id);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getLatestVitals = (patientId: string) => {
    const vitals = vitalSigns.filter(v => v.patientId === patientId);
    return vitals.length > 0 ? vitals[vitals.length - 1] : null;
  };

  const getPatientPrescriptions = (patientId: string) => {
    return prescriptions.filter(p => p.patientId === patientId);
  };

  const columns = [
    {
      key: 'name',
      label: 'Patient',
      render: (p: Patient) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm">
            {p.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{p.name}</p>
            <p className="text-xs text-gray-500">{p.age}y • {p.gender} • {p.bloodGroup}</p>
          </div>
        </div>
      ),
    },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'room', label: 'Room', render: (p: Patient) => p.room || '—' },
    { key: 'admissionDate', label: 'Admitted' },
    { key: 'status', label: 'Status', render: (p: Patient) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (p: Patient) => (
        <button onClick={() => setSelectedPatient(p)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
          View Records
        </button>
      ),
    },
  ];

  const vitals = selectedPatient ? getLatestVitals(selectedPatient.id) : null;
  const patPresc = selectedPatient ? getPatientPrescriptions(selectedPatient.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
        <p className="text-gray-500 mt-1">Patients under your care</p>
      </div>

      <DataTable columns={columns} data={myPatients} searchKeys={['name', 'diagnosis']} />

      <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title="Patient Record" size="lg">
        {selectedPatient && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xl">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedPatient.name}</h3>
                <p className="text-gray-500">{selectedPatient.age}y • {selectedPatient.gender} • {selectedPatient.bloodGroup}</p>
                <StatusBadge status={selectedPatient.status} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">📋 Diagnosis</h4>
              <p className="text-gray-800">{selectedPatient.diagnosis}</p>
            </div>

            {vitals && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">❤️ Latest Vitals ({vitals.date} {vitals.time})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-2 rounded text-center">
                    <p className="text-lg font-bold text-gray-800">{vitals.temperature}°F</p>
                    <p className="text-xs text-gray-500">Temperature</p>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <p className="text-lg font-bold text-gray-800">{vitals.bloodPressure}</p>
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <p className="text-lg font-bold text-gray-800">{vitals.heartRate}</p>
                    <p className="text-xs text-gray-500">Heart Rate</p>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <p className="text-lg font-bold text-gray-800">{vitals.oxygenLevel}%</p>
                    <p className="text-xs text-gray-500">SpO2</p>
                  </div>
                </div>
              </div>
            )}

            {patPresc.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">💊 Active Prescriptions</h4>
                {patPresc.map(presc => (
                  <div key={presc.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-gray-500">Prescribed: {presc.date}</p>
                    {presc.medications.map((med, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="font-medium">{med.name}</span>
                        <span className="text-gray-500">• {med.dosage} • {med.frequency} • {med.duration}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
