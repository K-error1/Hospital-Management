import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import * as api from '../../utils/api';
import { Patient, Doctor } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function ReceptionistPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Patient>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [pData, dData] = await Promise.all([api.fetchPatients(), api.fetchDoctors()]);
      setPatients(pData);
      setDoctors(dData);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openDetails = (p: Patient) => { setSelectedPatient(p); setEditData(p); setIsEditing(false); };

  const handleSave = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    try {
      await api.put('patients', selectedPatient.id, editData);
      await loadData();
      setSelectedPatient({ ...selectedPatient, ...editData } as Patient);
      setIsEditing(false);
    } catch { alert('Failed to update patient'); }
    finally { setIsSaving(false); }
  };

  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newPatient = {
      id: `PAT-${Date.now()}`,
      name: formData.get('name'),
      age: Number(formData.get('age')),
      gender: formData.get('gender'),
      bloodGroup: formData.get('bloodGroup'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      admissionDate: new Date().toISOString().split('T')[0],
      status: formData.get('status'),
      assignedDoctor: formData.get('assignedDoctor'),
      assignedNurse: 'nurse-1', // Defaulting for now
      room: formData.get('room') || '',
      diagnosis: formData.get('diagnosis') || 'Pending evaluation'
    };

    try {
      await api.post('patients', newPatient);
      await loadData();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to register patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Patients...</p></div>;
  }

  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'N/A';

  const columns = [
    {
      key: 'name',
      label: 'Patient',
      render: (p: Patient) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm">
            {p.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{p.name}</p>
            <p className="text-xs text-gray-500">{p.age}y • {p.gender} • {p.bloodGroup}</p>
          </div>
        </div>
      ),
    },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'room', label: 'Room', render: (p: Patient) => p.room || '—' },
    { key: 'assignedDoctor', label: 'Doctor', render: (p: Patient) => getDoctorName(p.assignedDoctor) },
    { key: 'admissionDate', label: 'Admitted' },
    { key: 'status', label: 'Status', render: (p: Patient) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (p: Patient) => (
        <button onClick={() => openDetails(p)} className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium">
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Patients</h2>
          <p className="text-gray-500 mt-1">View and manage all patients</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors text-sm font-medium shadow-sm">
          + Register Patient
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{patients.filter(p => p.status === 'Admitted').length}</p>
          <p className="text-xs text-blue-600">Admitted</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{patients.filter(p => p.status === 'Outpatient').length}</p>
          <p className="text-xs text-green-600">Outpatient</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{patients.filter(p => p.status === 'Critical').length}</p>
          <p className="text-xs text-red-600">Critical</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{patients.filter(p => p.status === 'Discharged').length}</p>
          <p className="text-xs text-gray-600">Discharged</p>
        </div>
      </div>

      <DataTable columns={columns} data={patients} searchKeys={['name', 'diagnosis', 'room']} />

      <Modal isOpen={!!selectedPatient} onClose={() => { setSelectedPatient(null); setIsEditing(false); }} title="Patient Details" size="lg">
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-2xl">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className={inputCls} placeholder="Full Name" />
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h3>
                    <p className="text-gray-500">{selectedPatient.age} years • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}</p>
                    <StatusBadge status={selectedPatient.status} />
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Age</label><input type="number" value={editData.age || ''} onChange={e => setEditData(d => ({ ...d, age: Number(e.target.value) }))} className={inputCls} /></div>
                <div><label className={labelCls}>Gender</label>
                  <select value={editData.gender || ''} onChange={e => setEditData(d => ({ ...d, gender: e.target.value as Patient['gender'] }))} className={inputCls}>
                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                </div>
                <div><label className={labelCls}>Blood Group</label><input value={editData.bloodGroup || ''} onChange={e => setEditData(d => ({ ...d, bloodGroup: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Phone</label><input value={editData.phone || ''} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Email</label><input value={editData.email || ''} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} className={inputCls} type="email" /></div>
                <div><label className={labelCls}>Room</label><input value={editData.room || ''} onChange={e => setEditData(d => ({ ...d, room: e.target.value }))} className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Address</label><input value={editData.address || ''} onChange={e => setEditData(d => ({ ...d, address: e.target.value }))} className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Diagnosis</label><input value={editData.diagnosis || ''} onChange={e => setEditData(d => ({ ...d, diagnosis: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Status</label>
                  <select value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as Patient['status'] }))} className={inputCls}>
                    <option value="Admitted">Admitted</option><option value="Outpatient">Outpatient</option>
                    <option value="Critical">Critical</option><option value="Discharged">Discharged</option>
                  </select>
                </div>
                <div><label className={labelCls}>Assign Doctor</label>
                  <select value={editData.assignedDoctor || ''} onChange={e => setEditData(d => ({ ...d, assignedDoctor: e.target.value }))} className={inputCls}>
                    {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Diagnosis</p><p className="font-medium">{selectedPatient.diagnosis}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Room</p><p className="font-medium">{selectedPatient.room || '—'}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Doctor</p><p className="font-medium">{getDoctorName(selectedPatient.assignedDoctor)}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Admission Date</p><p className="font-medium">{selectedPatient.admissionDate}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedPatient.phone}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedPatient.email}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2"><p className="text-xs text-gray-500">Address</p><p className="font-medium">{selectedPatient.address}</p></div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg text-sm hover:bg-fuchsia-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg text-sm hover:bg-fuchsia-700">✏️ Edit Patient</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Register New Patient" size="lg">
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input required name="name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input required name="age" type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select required name="gender" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <input required name="bloodGroup" type="text" placeholder="e.g. O+" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required name="phone" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
            <input required name="address" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Doctor</label>
              <select required name="assignedDoctor" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select required name="status" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                <option value="Outpatient">Outpatient</option>
                <option value="Admitted">Admitted</option>
                <option value="Critical">Critical</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room (Optional)</label>
              <input name="room" type="text" placeholder="e.g. 101-A" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Diagnosis (Optional)</label>
              <input name="diagnosis" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors font-medium text-sm disabled:opacity-50">
              {isSubmitting ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
