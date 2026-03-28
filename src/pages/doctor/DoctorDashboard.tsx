import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { appointments, patients, prescriptions } from '../../data/mockData';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const myAppointments = appointments.filter(a => a.doctorId === user?.id);
  const myPatients = patients.filter(p => p.assignedDoctor === user?.id);
  const todayAppointments = myAppointments.filter(a => a.date === '2026-01-28');
  const myPrescriptions = prescriptions.filter(p => p.doctorId === user?.id);
  const criticalPatients = myPatients.filter(p => p.status === 'Critical');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Patients" value={myPatients.length} icon="🏥" change={`${criticalPatients.length} critical`} changeType={criticalPatients.length > 0 ? 'negative' : 'positive'} />
        <StatCard title="Today's Appointments" value={todayAppointments.length} icon="📅" change="View schedule" changeType="neutral" />
        <StatCard title="Prescriptions Written" value={myPrescriptions.length} icon="💊" change="This month" changeType="neutral" />
        <StatCard title="Pending Reviews" value={2} icon="📋" change="2 reports due" changeType="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Today's Schedule</h3>
            <span className="text-sm text-gray-500">Jan 28, 2026</span>
          </div>
          <div className="divide-y divide-gray-50">
            {todayAppointments.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No appointments today</div>
            ) : (
              todayAppointments.map(apt => (
                <div key={apt.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-emerald-600">{apt.time}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{apt.patientName}</p>
                        <p className="text-sm text-gray-500">{apt.type} {apt.notes ? `• ${apt.notes}` : ''}</p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">My Patients</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {myPatients.slice(0, 5).map(p => (
              <div key={p.id} className={`p-4 ${p.status === 'Critical' ? 'bg-red-50/50' : 'hover:bg-gray-50/50'} transition-colors`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.diagnosis} • Room: {p.room || 'N/A'}</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalPatients.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚨</span>
            <h3 className="font-bold text-red-800">Critical Patient Alerts</h3>
          </div>
          <div className="space-y-2">
            {criticalPatients.map(p => (
              <div key={p.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.diagnosis} • Room: {p.room}</p>
                </div>
                <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
