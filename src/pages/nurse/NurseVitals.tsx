import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { vitalSigns, patients } from '../../data/mockData';
import { VitalSign } from '../../types';

export default function NurseVitals() {
  const { user } = useAuth();
  const myVitals = vitalSigns.filter(v => v.nurseId === user?.id);
  const myPatients = patients.filter(p => p.assignedNurse === user?.id);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'time', label: 'Time', render: (v: VitalSign) => <span className="font-semibold text-sky-700">{v.time}</span> },
    {
      key: 'patientName',
      label: 'Patient',
      render: (v: VitalSign) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-xs">
            {v.patientName.charAt(0)}
          </div>
          <span className="font-medium text-sm">{v.patientName}</span>
        </div>
      ),
    },
    {
      key: 'temperature',
      label: 'Temp (°F)',
      render: (v: VitalSign) => (
        <span className={`font-semibold ${v.temperature > 99 ? 'text-red-600' : 'text-gray-800'}`}>{v.temperature}</span>
      ),
    },
    { key: 'bloodPressure', label: 'BP' },
    {
      key: 'heartRate',
      label: 'Heart Rate',
      render: (v: VitalSign) => (
        <span className={`font-semibold ${v.heartRate > 90 ? 'text-orange-600' : 'text-gray-800'}`}>{v.heartRate} bpm</span>
      ),
    },
    {
      key: 'oxygenLevel',
      label: 'SpO2',
      render: (v: VitalSign) => (
        <span className={`font-semibold ${v.oxygenLevel < 95 ? 'text-red-600' : 'text-green-600'}`}>{v.oxygenLevel}%</span>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (v: VitalSign) => v.notes ? <span className="text-xs text-orange-600">⚠️ {v.notes}</span> : <span className="text-gray-400">—</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vital Signs</h2>
          <p className="text-gray-500 mt-1">Record and monitor patient vital signs</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow-sm">
          + Record Vitals
        </button>
      </div>

      <DataTable columns={columns} data={myVitals} title="Today's Vital Records" searchKeys={['patientName']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Record Vital Signs" size="lg">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm">
              <option value="">Select Patient</option>
              {myPatients.map(p => (
                <option key={p.id} value={p.id}>{p.name} - Room {p.room || 'N/A'}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
              <input type="number" step="0.1" placeholder="98.6" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
              <input type="text" placeholder="120/80" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
              <input type="number" placeholder="72" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Level (%)</label>
              <input type="number" placeholder="98" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" placeholder="70" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea placeholder="Any observations or concerns..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700">
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
