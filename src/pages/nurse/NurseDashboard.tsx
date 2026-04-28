import { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Patient, VitalSign, Nurse } from '../../types';

export default function NurseDashboard() {
  const { user } = useAuth();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsData, vitalsData, nursesData] = await Promise.all([
          api.fetchPatients(),
          api.fetchVitals(),
          api.fetchNurses()
        ]);
        setPatients(patientsData);
        setVitalSigns(vitalsData);
        setNurses(nursesData);
      } catch (err) {
        console.error("Error fetching nurse data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading data from Django Backend...</p></div>;
  }

  const nurseInfo = nurses.find(n => n.id === user?.id);
  const myPatients = patients.filter(p => p.assignedNurse === user?.id);
  const myVitals = vitalSigns.filter(v => v.nurseId === user?.id);
  const todayVitals = myVitals.filter(v => v.date === '2026-01-27');
  const criticalPatients = myPatients.filter(p => p.status === 'Critical');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome, {user?.name} • {nurseInfo?.assignedWard} • {nurseInfo?.shift} Shift</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Patients" value={myPatients.length} icon="🏥" change={`${criticalPatients.length} critical`} changeType={criticalPatients.length > 0 ? 'negative' : 'positive'} href="/nurse/patients" />
        <StatCard title="Vitals Recorded Today" value={todayVitals.length} icon="❤️" change="Keep recording" changeType="neutral" href="/nurse/vitals" />
        <StatCard title="Medications Due" value={4} icon="💊" change="2 in next hour" changeType="negative" href="/nurse/medications" />
        <StatCard title="Ward" value={nurseInfo?.assignedWard || 'N/A'} icon="🛏️" change={`${nurseInfo?.shift || 'No'} shift`} changeType="neutral" href="/nurse/ward" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients requiring attention */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">My Patients</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {myPatients.length === 0 && <div className="p-4 text-gray-500">No patients assigned.</div>}
            {myPatients.map(p => (
              <div key={p.id} className={`p-4 ${p.status === 'Critical' ? 'bg-red-50/50' : 'hover:bg-gray-50/50'} transition-colors`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      p.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">Room: {p.room || 'N/A'} • {p.diagnosis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Vital Recordings</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {todayVitals.length === 0 && <div className="p-4 text-gray-500">No vitals recorded today.</div>}
            {todayVitals.slice(0, 5).map(v => (
              <div key={v.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm">{v.patientName}</span>
                    <span className="text-xs text-gray-400">{v.time}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center bg-gray-50 rounded p-1.5">
                    <p className="text-xs text-gray-500">Temp</p>
                    <p className={`text-sm font-bold ${v.temperature > 37.2 ? 'text-red-600' : 'text-gray-800'}`}>{v.temperature}°</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded p-1.5">
                    <p className="text-xs text-gray-500">BP</p>
                    <p className="text-sm font-bold text-gray-800">{v.bloodPressure}</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded p-1.5">
                    <p className="text-xs text-gray-500">HR</p>
                    <p className={`text-sm font-bold ${v.heartRate > 90 ? 'text-orange-600' : 'text-gray-800'}`}>{v.heartRate}</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded p-1.5">
                    <p className="text-xs text-gray-500">SpO2</p>
                    <p className={`text-sm font-bold ${v.oxygenLevel < 95 ? 'text-red-600' : 'text-gray-800'}`}>{v.oxygenLevel}%</p>
                  </div>
                </div>
                {v.notes && <p className="text-xs text-orange-600 mt-2 font-medium">⚠️ {v.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">📋 Upcoming Tasks</h3>
        <div className="space-y-3">
          {[
            { time: '10:00', task: 'Administer medication - John Ochieng (Room 301-A)', priority: 'high' },
            { time: '10:30', task: 'Record vitals - Robert Kipchoge (ICU-2)', priority: 'critical' },
            { time: '11:00', task: 'Change dressing - Emily Nduta (Room 205-B)', priority: 'medium' },
            { time: '12:00', task: 'Lunch medication round', priority: 'high' },
            { time: '14:00', task: 'Record vitals - All patients', priority: 'high' },
          ].map((task, i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${
              task.priority === 'critical' ? 'bg-red-50 border border-red-100' :
              task.priority === 'high' ? 'bg-orange-50 border border-orange-100' :
              'bg-gray-50 border border-gray-100'
            }`}>
              <span className="text-sm font-bold text-gray-700 w-14">{task.time}</span>
              <span className="text-sm text-gray-700 flex-1">{task.task}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                task.priority === 'critical' ? 'bg-red-200 text-red-800' :
                task.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                'bg-gray-200 text-gray-700'
              }`}>{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
