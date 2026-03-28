import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { doctors } from '../../data/mockData';
import { Doctor } from '../../types';

export default function AdminDoctors() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const columns = [
    {
      key: 'name',
      label: 'Doctor',
      render: (doc: Doctor) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
            {doc.name.replace('Dr. ', '').charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{doc.name}</p>
            <p className="text-xs text-gray-500">{doc.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'specialization', label: 'Specialization' },
    { key: 'department', label: 'Department' },
    { key: 'experience', label: 'Experience' },
    { key: 'patientsCount', label: 'Patients', render: (doc: Doctor) => <span className="font-semibold">{doc.patientsCount}</span> },
    { key: 'status', label: 'Status', render: (doc: Doctor) => <StatusBadge status={doc.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (doc: Doctor) => (
        <button onClick={() => setSelectedDoctor(doc)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Doctors</h2>
          <p className="text-gray-500 mt-1">View and manage all doctors in the hospital</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Doctor
        </button>
      </div>

      <DataTable columns={columns} data={doctors} searchKeys={['name', 'specialization', 'department']} />

      <Modal isOpen={!!selectedDoctor} onClose={() => setSelectedDoctor(null)} title="Doctor Details" size="md">
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-2xl">
                {selectedDoctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedDoctor.name}</h3>
                <p className="text-gray-500">{selectedDoctor.specialization}</p>
                <StatusBadge status={selectedDoctor.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium">{selectedDoctor.department}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Experience</p>
                <p className="font-medium">{selectedDoctor.experience}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Qualification</p>
                <p className="font-medium">{selectedDoctor.qualification}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Patients</p>
                <p className="font-medium">{selectedDoctor.patientsCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{selectedDoctor.phone}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{selectedDoctor.email}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
