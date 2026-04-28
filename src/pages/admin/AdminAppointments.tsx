import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import * as api from '../../utils/api';
import { Appointment, Patient, Doctor } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);
  const [editData, setEditData] = useState<Partial<Appointment>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const [apptData, patData, docData] = await Promise.all([
        api.fetchAppointments(), api.fetchPatients(), api.fetchDoctors()
      ]);
      setAppointments(apptData);
      setPatients(patData);
      setDoctors(docData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openEdit = (a: Appointment) => { setEditAppt(a); setEditData({ ...a }); };

  const handleSaveAppt = async () => {
    if (!editAppt) return;
    setIsSaving(true);
    try {
      await api.put('appointments', editAppt.id, editData);
      await loadData();
      setEditAppt(null);
    } catch { alert('Failed to update appointment'); }
    finally { setIsSaving(false); }
  };

  const handleAddAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const patientId = formData.get('patientId') as string;
    const doctorId = formData.get('doctorId') as string;
    const selectedPatient = patients.find(p => p.id === patientId);
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    const newAppointment = {
      id: `APT-${Date.now()}`,
      patientId, patientName: selectedPatient?.name || '',
      doctorId, doctorName: selectedDoctor?.name || '',
      date: formData.get('date'),
      time: formData.get('time'),
      status: 'Scheduled',
      type: formData.get('type')
    };
    try {
      await api.post('appointments', newAppointment);
      await loadData();
      setIsAddModalOpen(false);
    } catch { alert('Failed to schedule appointment'); }
    finally { setIsSubmitting(false); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Appointments...</p></div>;
  }

  const typeColors: Record<string, string> = {
    Consultation: 'bg-blue-100 text-blue-700',
    'Follow-up': 'bg-green-100 text-green-700',
    Emergency: 'bg-red-100 text-red-700',
    Surgery: 'bg-purple-100 text-purple-700',
  };

  const columns = [
    { key: 'id', label: 'ID', render: (a: Appointment) => <span className="font-mono text-xs text-gray-500">{a.id.slice(0,12)}...</span> },
    {
      key: 'patientName', label: 'Patient',
      render: (a: Appointment) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs">{a.patientName.charAt(0)}</div>
          <span className="font-medium">{a.patientName}</span>
        </div>
      ),
    },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type', render: (a: Appointment) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[a.type] || 'bg-gray-100 text-gray-700'}`}>{a.type}</span> },
    { key: 'status', label: 'Status', render: (a: Appointment) => <StatusBadge status={a.status} /> },
    {
      key: 'actions', label: 'Actions',
      render: (a: Appointment) => (
        <button onClick={() => openEdit(a)} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-100 transition-colors">
          ✏️ Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
          <p className="text-gray-500 mt-1">View and manage hospital appointments</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Scheduled', status: 'Scheduled', color: 'blue' },
          { label: 'In Progress', status: 'In Progress', color: 'yellow' },
          { label: 'Completed', status: 'Completed', color: 'green' },
          { label: 'Cancelled', status: 'Cancelled', color: 'red' },
        ].map(({ label, status, color }) => (
          <div key={status} className={`bg-${color}-50 border border-${color}-100 rounded-lg p-3 text-center`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{appointments.filter(a => a.status === status).length}</p>
            <p className={`text-xs text-${color}-600`}>{label}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={appointments} searchKeys={['patientName', 'doctorName', 'type']} />

      {/* Edit Appointment Modal */}
      <Modal isOpen={!!editAppt} onClose={() => setEditAppt(null)} title="Edit Appointment" size="md">
        {editAppt && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-700">Patient: {editAppt.patientName}</p>
              <p className="text-gray-500">Doctor: {editAppt.doctorName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={editData.date || ''} onChange={e => setEditData(d => ({ ...d, date: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" value={editData.time || ''} onChange={e => setEditData(d => ({ ...d, time: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Appointment Type</label>
              <select value={editData.type || ''} onChange={e => setEditData(d => ({ ...d, type: e.target.value as Appointment['type'] }))} className={inputCls}>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as Appointment['status'] }))} className={inputCls}>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea value={editData.notes || ''} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Optional notes..." />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setEditAppt(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSaveAppt} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Appointment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Schedule Appointment" size="md">
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <div>
            <label className={labelCls}>Patient</label>
            <select required name="patientId" className={inputCls}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Doctor</label>
            <select required name="doctorId" className={inputCls}>
              <option value="">Select a doctor...</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Date</label><input required name="date" type="date" className={inputCls} /></div>
            <div><label className={labelCls}>Time</label><input required name="time" type="time" className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Appointment Type</label>
            <select required name="type" className={inputCls}>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50">
              {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
