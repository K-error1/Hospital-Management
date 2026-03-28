import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { patients, doctors } from '../../data/mockData';
import { Patient } from '../../types';

export default function AdminPatients() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'N/A';

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
    { key: 'assignedDoctor', label: 'Doctor', render: (p: Patient) => getDoctorName(p.assignedDoctor) },
    { key: 'admissionDate', label: 'Admitted' },
    { key: 'status', label: 'Status', render: (p: Patient) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (p: Patient) => (
        <button onClick={() => setSelectedPatient(p)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Patients</h2>
          <p className="text-gray-500 mt-1">View and manage all patients</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Register Patient
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{patients.filter(p => p.status === 'Admitted').length}</p>
          <p className="text-xs text-blue-600">Admitted</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{patients.filter(p => p.status === 'Outpatient').length}</p>
          <p className="text-xs text-green-600">Outpatient</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{patients.filter(p => p.status === 'Critical').length}</p>
          <p className="text-xs text-red-600">Critical</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{patients.filter(p => p.status === 'Discharged').length}</p>
          <p className="text-xs text-gray-600">Discharged</p>
        </div>
      </div>

      <DataTable columns={columns} data={patients} searchKeys={['name', 'diagnosis', 'room']} />

      <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title="Patient Details" size="lg">
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-2xl">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h3>
                <p className="text-gray-500">{selectedPatient.age} years • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}</p>
                <StatusBadge status={selectedPatient.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Diagnosis</p><p className="font-medium">{selectedPatient.diagnosis}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Room</p><p className="font-medium">{selectedPatient.room || '—'}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Doctor</p><p className="font-medium">{getDoctorName(selectedPatient.assignedDoctor)}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Admission Date</p><p className="font-medium">{selectedPatient.admissionDate}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedPatient.phone}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedPatient.email}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg col-span-2"><p className="text-xs text-gray-500">Address</p><p className="font-medium">{selectedPatient.address}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
