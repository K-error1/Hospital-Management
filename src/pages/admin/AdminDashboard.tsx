import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { patients, doctors, nurses, appointments, departments, billingRecords } from '../../data/mockData';

export default function AdminDashboard() {
  const totalRevenue = billingRecords.reduce((sum, b) => sum + b.totalAmount, 0);
  const occupiedBeds = departments.reduce((sum, d) => sum + d.bedsOccupied, 0);
  const totalBeds = departments.reduce((sum, d) => sum + d.bedsTotal, 0);
  const todayAppointments = appointments.filter(a => a.date === '2026-01-28');
  const criticalPatients = patients.filter(p => p.status === 'Critical');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h2>
        <p className="text-gray-500 mt-1">Hospital overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={patients.length} icon="🏥" change="+3 this week" changeType="positive" />
        <StatCard title="Active Doctors" value={doctors.filter(d => d.status !== 'On Leave').length} icon="👨‍⚕️" change={`${doctors.length} total`} changeType="neutral" />
        <StatCard title="Nurses on Duty" value={nurses.filter(n => n.status === 'On Duty').length} icon="👩‍⚕️" change={`${nurses.length} total`} changeType="neutral" />
        <StatCard title="Bed Occupancy" value={`${Math.round((occupiedBeds / totalBeds) * 100)}%`} icon="🛏️" change={`${occupiedBeds}/${totalBeds} beds`} changeType={occupiedBeds / totalBeds > 0.8 ? 'negative' : 'positive'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={todayAppointments.length} icon="📅" change="2 completed" changeType="positive" />
        <StatCard title="Critical Patients" value={criticalPatients.length} icon="🚨" change="Needs attention" changeType="negative" />
        <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon="💰" change="+12% this month" changeType="positive" />
        <StatCard title="Departments" value={departments.length} icon="🏢" change="All operational" changeType="positive" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Today's Appointments</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {todayAppointments.map(apt => (
              <div key={apt.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{apt.patientName}</p>
                      <p className="text-xs text-gray-500">{apt.doctorName} • {apt.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{apt.time}</p>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Departments</h3>
          </div>
          <div className="p-4 space-y-4">
            {departments.map(dept => (
              <div key={dept.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{dept.name}</span>
                  <span className="text-gray-500">{dept.bedsOccupied}/{dept.bedsTotal}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      dept.bedsOccupied / dept.bedsTotal > 0.8
                        ? 'bg-red-500'
                        : dept.bedsOccupied / dept.bedsTotal > 0.6
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(dept.bedsOccupied / dept.bedsTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <span className="text-lg">🚨</span>
            <h3 className="font-semibold text-gray-800">Critical Patients Alert</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {criticalPatients.map(p => (
              <div key={p.id} className="p-4 bg-red-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-500">Room: {p.room} • {p.diagnosis}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
            {criticalPatients.length === 0 && (
              <div className="p-4 text-center text-gray-400">No critical patients</div>
            )}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Revenue Summary</h3>
          </div>
          <div className="p-4 space-y-3">
            {billingRecords.slice(0, 4).map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-800">{bill.patientName}</p>
                  <p className="text-xs text-gray-500">{bill.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${bill.totalAmount.toLocaleString()}</p>
                  <StatusBadge status={bill.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
