import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Appointment } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [editData, setEditData] = useState<Partial<Appointment>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openReschedule = (a: Appointment) => { setRescheduleAppt(a); setEditData({ date: a.date, time: a.time, notes: a.notes || '' }); };

  const handleStatusUpdate = async (appt: Appointment, newStatus: Appointment['status']) => {
    try {
      await api.put('appointments', appt.id, { ...appt, status: newStatus });
      await loadData();
    } catch { alert('Failed to update appointment status'); }
  };

  const handleSaveReschedule = async () => {
    if (!rescheduleAppt) return;
    setIsSaving(true);
    try {
      await api.put('appointments', rescheduleAppt.id, { ...rescheduleAppt, ...editData, status: 'Scheduled' });
      await loadData();
      setRescheduleAppt(null);
    } catch { alert('Failed to reschedule appointment'); }
    finally { setIsSaving(false); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Appointments...</p></div>;
  }

  const myAppointments = appointments.filter(a => a.doctorId === user?.id);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time', render: (a: Appointment) => <span className="font-semibold text-emerald-700">{a.time}</span> },
    {
      key: 'patientName', label: 'Patient',
      render: (a: Appointment) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs">{a.patientName.charAt(0)}</div>
          <span className="font-medium">{a.patientName}</span>
        </div>
      ),
    },
    {
      key: 'type', label: 'Type',
      render: (a: Appointment) => {
        const icons: Record<string, string> = { Consultation: '🩺', 'Follow-up': '🔄', Emergency: '🚨', Surgery: '⚕️' };
        return <span>{icons[a.type] || ''} {a.type}</span>;
      },
    },
    { key: 'notes', label: 'Notes', render: (a: Appointment) => <span className="text-gray-500 text-xs">{a.notes || '—'}</span> },
    { key: 'status', label: 'Status', render: (a: Appointment) => <StatusBadge status={a.status} /> },
    {
      key: 'actions', label: 'Actions',
      render: (a: Appointment) => (
        <div className="flex gap-1.5 flex-wrap">
          {a.status === 'Scheduled' && (
            <button
              onClick={() => handleStatusUpdate(a, 'In Progress')}
              className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-200 transition-colors"
            >
              ▶ Start
            </button>
          )}
          {a.status === 'In Progress' && (
            <button
              onClick={() => handleStatusUpdate(a, 'Completed')}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
            >
              ✓ Complete
            </button>
          )}
          {(a.status === 'Scheduled' || a.status === 'In Progress') && (
            <button
              onClick={() => openReschedule(a)}
              className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium hover:bg-amber-200 transition-colors"
            >
              📅 Reschedule
            </button>
          )}
          {a.status === 'Scheduled' && (
            <button
              onClick={() => handleStatusUpdate(a, 'Cancelled')}
              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
            >
              ✕ Cancel
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

      {/* Reschedule Modal */}
      <Modal isOpen={!!rescheduleAppt} onClose={() => setRescheduleAppt(null)} title="Reschedule Appointment" size="md">
        {rescheduleAppt && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
              <p className="font-medium text-gray-800">{rescheduleAppt.patientName}</p>
              <p className="text-sm text-gray-500">{rescheduleAppt.type} · Currently: {rescheduleAppt.date} at {rescheduleAppt.time}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>New Date</label>
                <input type="date" value={editData.date || ''} onChange={e => setEditData(d => ({ ...d, date: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>New Time</label>
                <input type="time" value={editData.time || ''} onChange={e => setEditData(d => ({ ...d, time: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes / Reason for Reschedule</label>
              <textarea value={editData.notes || ''} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Optional — add a reason or instructions..." />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setRescheduleAppt(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSaveReschedule} disabled={isSaving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
