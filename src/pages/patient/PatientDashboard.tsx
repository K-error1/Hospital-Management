import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { appointments, prescriptions, billingRecords, patients, doctors, vitalSigns } from '../../data/mockData';

export default function PatientDashboard() {
  const { user } = useAuth();
  const patientInfo = patients.find(p => p.id === user?.id);
  const myAppointments = appointments.filter(a => a.patientId === user?.id);
  const myPrescriptions = prescriptions.filter(p => p.patientId === user?.id);
  const myBills = billingRecords.filter(b => b.patientId === user?.id);
  const myVitals = vitalSigns.filter(v => v.patientId === user?.id);
  const latestVitals = myVitals.length > 0 ? myVitals[myVitals.length - 1] : null;
  const doctorName = patientInfo ? doctors.find(d => d.id === patientInfo.assignedDoctor)?.name : 'N/A';
  const upcomingAppts = myAppointments.filter(a => a.status === 'Scheduled');
  const pendingBills = myBills.filter(b => b.status === 'Pending');
  const totalDue = pendingBills.reduce((sum, b) => sum + (b.totalAmount - b.insuranceCovered), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Patient Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
      </div>

      {/* Patient Info Card */}
      {patientInfo && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {patientInfo.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{patientInfo.name}</h3>
              <p className="text-white/80">{patientInfo.age} years • {patientInfo.gender} • Blood Group: {patientInfo.bloodGroup}</p>
              <p className="text-white/70 text-sm mt-1">Attending Doctor: {doctorName}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-white/70">Status</p>
              <p className="font-bold text-lg">{patientInfo.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Upcoming Appointments" value={upcomingAppts.length} icon="📅" change="View all" changeType="neutral" />
        <StatCard title="Active Medications" value={myPrescriptions.reduce((sum, p) => sum + p.medications.length, 0)} icon="💊" change={`${myPrescriptions.length} prescriptions`} changeType="neutral" />
        <StatCard title="Balance Due" value={`$${totalDue.toLocaleString()}`} icon="💰" change={`${pendingBills.length} pending bills`} changeType={totalDue > 0 ? 'negative' : 'positive'} />
        <StatCard title="Last Visit" value={myAppointments.filter(a => a.status === 'Completed').length > 0 ? myAppointments.filter(a => a.status === 'Completed')[0].date : 'N/A'} icon="🏥" change="Completed" changeType="positive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Vitals */}
        {latestVitals && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Latest Vitals</h3>
              <span className="text-xs text-gray-400">{latestVitals.date} {latestVitals.time}</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-3xl mb-1">🌡️</p>
                <p className="text-2xl font-bold text-gray-800">{latestVitals.temperature}°F</p>
                <p className="text-xs text-gray-500">Temperature</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-3xl mb-1">💓</p>
                <p className="text-2xl font-bold text-gray-800">{latestVitals.bloodPressure}</p>
                <p className="text-xs text-gray-500">Blood Pressure</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-3xl mb-1">❤️</p>
                <p className="text-2xl font-bold text-gray-800">{latestVitals.heartRate} bpm</p>
                <p className="text-xs text-gray-500">Heart Rate</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-3xl mb-1">🫁</p>
                <p className="text-2xl font-bold text-gray-800">{latestVitals.oxygenLevel}%</p>
                <p className="text-xs text-gray-500">Oxygen Level</p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Upcoming Appointments</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingAppts.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No upcoming appointments</div>
            ) : (
              upcomingAppts.map(apt => (
                <div key={apt.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{apt.doctorName}</p>
                      <p className="text-sm text-gray-500">{apt.type} • {apt.date} at {apt.time}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Current Medications */}
      {myPrescriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">💊 Current Medications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myPrescriptions[0].medications.map((med, i) => (
              <div key={i} className="bg-violet-50 border border-violet-100 rounded-lg p-3">
                <p className="font-semibold text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                <p className="text-xs text-gray-500 mt-1">Duration: {med.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
