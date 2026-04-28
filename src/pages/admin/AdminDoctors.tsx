import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import * as api from '../../utils/api';
import { Doctor } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Doctor>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openDetails = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setEditData(doc);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedDoctor) return;
    setIsSaving(true);
    try {
      await api.put('doctors', selectedDoctor.id, editData);
      await loadData();
      setSelectedDoctor({ ...selectedDoctor, ...editData } as Doctor);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update doctor');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor? They will not be able to log in anymore.')) return;
    try {
      await api.remove('doctors', id);
      await api.remove('users', id).catch(() => {});
      await loadData();
      if (selectedDoctor?.id === id) {
        setSelectedDoctor(null);
      }
    } catch {
      alert('Failed to delete doctor');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Doctors...</p></div>;
  }

  const columns = [
    {
      key: 'name', label: 'Doctor',
      render: (doc: Doctor) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
            {doc.name.replace('Dr. ', '').charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{doc.name}</p>
            <p className="text-xs text-gray-500">{doc.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'specialization', label: 'Specialization' },
    { key: 'department', label: 'Department' },
    { key: 'experience', label: 'Experience' },
    { key: 'patientsCount', label: 'Patients', render: (doc: Doctor) => <span className="font-semibold">{doc.patientsCount}</span> },
    { key: 'status', label: 'Status', render: (doc: Doctor) => <StatusBadge status={doc.status} /> },
    {
      key: 'actions', label: 'Actions',
      render: (doc: Doctor) => (
        <div className="flex gap-3">
          <button onClick={() => openDetails(doc)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View Details
          </button>
          <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Doctors</h2>
          <p className="text-gray-500 mt-1">View and manage all doctors in the hospital</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Doctor
        </button>
      </div>

      <DataTable columns={columns} data={doctors} searchKeys={['name', 'specialization', 'department']} />

      {/* View / Edit Details Modal */}
      <Modal isOpen={!!selectedDoctor} onClose={() => { setSelectedDoctor(null); setIsEditing(false); }} title="Doctor Details" size="md">
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-2xl">
                {selectedDoctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className={inputCls} placeholder="Full Name" />
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-800">{selectedDoctor.name}</h3>
                    <p className="text-gray-500">{selectedDoctor.specialization}</p>
                    <StatusBadge status={selectedDoctor.status} />
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Email</label>
                  <input value={editData.email || ''} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} className={inputCls} type="email" />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input value={editData.phone || ''} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Specialization</label>
                  <input value={editData.specialization || ''} onChange={e => setEditData(d => ({ ...d, specialization: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Department</label>
                  <input value={editData.department || ''} onChange={e => setEditData(d => ({ ...d, department: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Experience</label>
                  <input value={editData.experience || ''} onChange={e => setEditData(d => ({ ...d, experience: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Qualification</label>
                  <input value={editData.qualification || ''} onChange={e => setEditData(d => ({ ...d, qualification: e.target.value }))} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Status</label>
                  <select value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as Doctor['status'] }))} className={inputCls}>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="In Surgery">In Surgery</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { label: 'Department', val: selectedDoctor.department },
                  { label: 'Experience', val: selectedDoctor.experience },
                  { label: 'Qualification', val: selectedDoctor.qualification },
                  { label: 'Patients', val: selectedDoctor.patientsCount },
                  { label: 'Phone', val: selectedDoctor.phone },
                  { label: 'Email', val: selectedDoctor.email },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-sm">{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                  ✏️ Edit Doctor
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Doctor" size="md">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as any;
          const newDoctor = {
            id: `DOC-${Date.now()}`,
            name: form[0].value, specialization: form[1].value, department: form[2].value,
            experience: form[3].value, qualification: form[4].value, phone: form[5].value,
            email: form[6].value, status: 'Available', patientsCount: 0
          };
          try {
            await api.post('doctors', newDoctor);
            setShowAddModal(false);
            await loadData();
          } catch { alert('Failed to add doctor'); }
        }} className="space-y-3">
          <input required placeholder="Full Name (e.g. Dr. John Doe)" className={inputCls} />
          <input required placeholder="Specialization (e.g. Cardiology)" className={inputCls} />
          <input required placeholder="Department" className={inputCls} />
          <input required placeholder="Experience (e.g. 10 Years)" className={inputCls} />
          <input required placeholder="Qualification" className={inputCls} />
          <input required placeholder="Phone Number" className={inputCls} />
          <input required type="email" placeholder="Email Address" className={inputCls} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Save Doctor</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
