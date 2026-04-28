import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import * as api from '../../utils/api';
import { Nurse } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function AdminNurses() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Nurse>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchNurses();
      setNurses(data);
    } catch (err) {
      console.error('Error fetching nurses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openDetails = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setEditData(nurse);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedNurse) return;
    setIsSaving(true);
    try {
      await api.put('nurses', selectedNurse.id, editData);
      await loadData();
      setSelectedNurse({ ...selectedNurse, ...editData } as Nurse);
      setIsEditing(false);
    } catch { alert('Failed to update nurse'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nurse? They will not be able to log in anymore.')) return;
    try {
      await api.remove('nurses', id);
      await api.remove('users', id).catch(() => {});
      await loadData();
      if (selectedNurse?.id === id) {
        setSelectedNurse(null);
      }
    } catch {
      alert('Failed to delete nurse');
    }
  };

  const handleAddNurse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newNurse = {
      id: `NUR-${Date.now()}`,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      shift: formData.get('shift'),
      assignedWard: formData.get('assignedWard'),
      status: 'On Duty',
      patientsCount: 0
    };

    try {
      await api.post('nurses', newNurse);
      await loadData();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add nurse');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Nurses...</p></div>;
  }

  const columns = [
    {
      key: 'name',
      label: 'Nurse',
      render: (nurse: Nurse) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-sm">
            {nurse.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{nurse.name}</p>
            <p className="text-xs text-gray-500">{nurse.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'assignedWard', label: 'Ward' },
    {
      key: 'shift',
      label: 'Shift',
      render: (nurse: Nurse) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          nurse.shift === 'Morning' ? 'bg-amber-100 text-amber-700' :
          nurse.shift === 'Afternoon' ? 'bg-orange-100 text-orange-700' :
          'bg-indigo-100 text-indigo-700'
        }`}>
          {nurse.shift === 'Morning' ? '☀️' : nurse.shift === 'Afternoon' ? '🌤️' : '🌙'} {nurse.shift}
        </span>
      ),
    },
    { key: 'patientsCount', label: 'Patients', render: (nurse: Nurse) => <span className="font-semibold">{nurse.patientsCount}</span> },
    { key: 'status', label: 'Status', render: (nurse: Nurse) => <StatusBadge status={nurse.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (nurse: Nurse) => (
        <div className="flex gap-3">
          <button onClick={() => openDetails(nurse)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View Details
          </button>
          <button onClick={() => handleDelete(nurse.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
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
          <h2 className="text-2xl font-bold text-gray-800">Manage Nurses</h2>
          <p className="text-gray-500 mt-1">View and manage all nursing staff</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Nurse
        </button>
      </div>

      <DataTable columns={columns} data={nurses} searchKeys={['name', 'department', 'assignedWard']} />

      <Modal isOpen={!!selectedNurse} onClose={() => { setSelectedNurse(null); setIsEditing(false); }} title="Nurse Details">
        {selectedNurse && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-2xl">
                {selectedNurse.name.charAt(0)}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className={inputCls} placeholder="Full Name" />
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-800">{selectedNurse.name}</h3>
                    <p className="text-gray-500">{selectedNurse.department}</p>
                    <StatusBadge status={selectedNurse.status} />
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Email</label><input value={editData.email || ''} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} className={inputCls} type="email" /></div>
                <div><label className={labelCls}>Phone</label><input value={editData.phone || ''} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Department</label><input value={editData.department || ''} onChange={e => setEditData(d => ({ ...d, department: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Assigned Ward</label><input value={editData.assignedWard || ''} onChange={e => setEditData(d => ({ ...d, assignedWard: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Shift</label>
                  <select value={editData.shift || ''} onChange={e => setEditData(d => ({ ...d, shift: e.target.value as Nurse['shift'] }))} className={inputCls}>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div><label className={labelCls}>Status</label>
                  <select value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as Nurse['status'] }))} className={inputCls}>
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[{label:'Ward', val: selectedNurse.assignedWard},{label:'Shift', val: selectedNurse.shift},{label:'Patients', val: selectedNurse.patientsCount},{label:'Phone', val: selectedNurse.phone},{label:'Email', val: selectedNurse.email},{label:'Department', val: selectedNurse.department}].map(item => (
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
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">✏️ Edit Nurse</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Add New Nurse" size="md">
        <form onSubmit={handleAddNurse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required name="name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Jane Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required name="phone" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input required name="department" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <select required name="shift" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Ward</label>
            <input required name="assignedWard" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Nurse'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
