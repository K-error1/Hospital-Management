import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { nurses } from '../../data/mockData';
import { Nurse } from '../../types';

export default function AdminNurses() {
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  const columns = [
    {
      key: 'name',
      label: 'Nurse',
      render: (nurse: Nurse) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-sm">
            {nurse.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{nurse.name}</p>
            <p className="text-xs text-gray-500">{nurse.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'assignedWard', label: 'Ward' },
    {
      key: 'shift',
      label: 'Shift',
      render: (nurse: Nurse) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          nurse.shift === 'Morning' ? 'bg-amber-100 text-amber-700' :
          nurse.shift === 'Afternoon' ? 'bg-orange-100 text-orange-700' :
          'bg-indigo-100 text-indigo-700'
        }`}>
          {nurse.shift === 'Morning' ? '☀️' : nurse.shift === 'Afternoon' ? '🌤️' : '🌙'} {nurse.shift}
        </span>
      ),
    },
    { key: 'patientsCount', label: 'Patients', render: (nurse: Nurse) => <span className="font-semibold">{nurse.patientsCount}</span> },
    { key: 'status', label: 'Status', render: (nurse: Nurse) => <StatusBadge status={nurse.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (nurse: Nurse) => (
        <button onClick={() => setSelectedNurse(nurse)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Nurses</h2>
          <p className="text-gray-500 mt-1">View and manage all nursing staff</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Nurse
        </button>
      </div>

      <DataTable columns={columns} data={nurses} searchKeys={['name', 'department', 'assignedWard']} />

      <Modal isOpen={!!selectedNurse} onClose={() => setSelectedNurse(null)} title="Nurse Details">
        {selectedNurse && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-2xl">
                {selectedNurse.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedNurse.name}</h3>
                <p className="text-gray-500">{selectedNurse.department}</p>
                <StatusBadge status={selectedNurse.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Ward</p>
                <p className="font-medium">{selectedNurse.assignedWard}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Shift</p>
                <p className="font-medium">{selectedNurse.shift}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Patients Assigned</p>
                <p className="font-medium">{selectedNurse.patientsCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{selectedNurse.phone}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
