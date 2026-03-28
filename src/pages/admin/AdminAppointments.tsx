import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { appointments } from '../../data/mockData';
import { Appointment } from '../../types';

export default function AdminAppointments() {
  const typeColors: Record<string, string> = {
    Consultation: 'bg-blue-100 text-blue-700',
    'Follow-up': 'bg-green-100 text-green-700',
    Emergency: 'bg-red-100 text-red-700',
    Surgery: 'bg-purple-100 text-purple-700',
  };

  const columns = [
    { key: 'id', label: 'ID', render: (a: Appointment) => <span className="font-mono text-xs text-gray-500">{a.id}</span> },
    {
      key: 'patientName',
      label: 'Patient',
      render: (a: Appointment) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs">
            {a.patientName.charAt(0)}
          </div>
          <span className="font-medium">{a.patientName}</span>
        </div>
      ),
    },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    {
      key: 'type',
      label: 'Type',
      render: (a: Appointment) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[a.type] || 'bg-gray-100 text-gray-700'}`}>
          {a.type}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (a: Appointment) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
          <p className="text-gray-500 mt-1">View and manage hospital appointments</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{appointments.filter(a => a.status === 'Scheduled').length}</p>
          <p className="text-xs text-blue-600">Scheduled</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{appointments.filter(a => a.status === 'In Progress').length}</p>
          <p className="text-xs text-yellow-600">In Progress</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{appointments.filter(a => a.status === 'Completed').length}</p>
          <p className="text-xs text-green-600">Completed</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{appointments.filter(a => a.status === 'Cancelled').length}</p>
          <p className="text-xs text-red-600">Cancelled</p>
        </div>
      </div>

      <DataTable columns={columns} data={appointments} searchKeys={['patientName', 'doctorName', 'type']} />
    </div>
  );
}
