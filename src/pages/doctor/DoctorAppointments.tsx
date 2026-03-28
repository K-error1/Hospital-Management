import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { appointments } from '../../data/mockData';
import { Appointment } from '../../types';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const myAppointments = appointments.filter(a => a.doctorId === user?.id);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time', render: (a: Appointment) => <span className="font-semibold text-emerald-700">{a.time}</span> },
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
    {
      key: 'type',
      label: 'Type',
      render: (a: Appointment) => {
        const typeIcons: Record<string, string> = { Consultation: '🩺', 'Follow-up': '🔄', Emergency: '🚨', Surgery: '⚕️' };
        return <span>{typeIcons[a.type] || ''} {a.type}</span>;
      },
    },
    { key: 'notes', label: 'Notes', render: (a: Appointment) => <span className="text-gray-500 text-xs">{a.notes || '—'}</span> },
    { key: 'status', label: 'Status', render: (a: Appointment) => <StatusBadge status={a.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (a: Appointment) => (
        <div className="flex gap-2">
          {a.status === 'Scheduled' && (
            <button className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-200">
              Start
            </button>
          )}
          {a.status === 'In Progress' && (
            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">
              Complete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <p className="text-gray-500 mt-1">View and manage your appointments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{myAppointments.filter(a => a.status === 'Scheduled').length}</p>
          <p className="text-xs text-blue-600">Upcoming</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{myAppointments.filter(a => a.status === 'In Progress').length}</p>
          <p className="text-xs text-yellow-600">In Progress</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{myAppointments.filter(a => a.status === 'Completed').length}</p>
          <p className="text-xs text-green-600">Completed</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{myAppointments.length}</p>
          <p className="text-xs text-purple-600">Total</p>
        </div>
      </div>

      <DataTable columns={columns} data={myAppointments} searchKeys={['patientName', 'type', 'date']} />
    </div>
  );
}
