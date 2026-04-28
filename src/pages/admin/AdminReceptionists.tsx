import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import * as api from '../../utils/api';
import { User } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function AdminReceptionists() {
  const [receptionists, setReceptionists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecep, setSelectedRecep] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchUsers();
      // Filter out only receptionists
      setReceptionists(data.filter((u: User) => u.role === 'receptionist'));
    } catch (err) {
      console.error('Error fetching receptionists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openDetails = (recep: User) => {
    setSelectedRecep(recep);
    setEditData(recep);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedRecep) return;
    setIsSaving(true);
    try {
      await api.put('users', selectedRecep.id, editData);
      await loadData();
      setSelectedRecep({ ...selectedRecep, ...editData } as User);
      setIsEditing(false);
    } catch { alert('Failed to update receptionist'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? They will not be able to log in anymore.')) return;
    try {
      await api.remove('users', id);
      await loadData();
      if (selectedRecep?.id === id) {
        setSelectedRecep(null);
      }
    } catch {
      alert('Failed to delete receptionist');
    }
  };

  const handleAddRecep = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newRecep = {
      id: `REC-${Date.now()}`,
      username: formData.get('email'), // Using email as username
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: 'password123', // Default password
      role: 'receptionist'
    };

    try {
      await api.post('users', newRecep);
      await loadData();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add receptionist');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Receptionists...</p></div>;
  }

  const columns = [
    {
      key: 'name',
      label: 'Receptionist',
      render: (recep: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-700 font-bold text-sm">
            {recep.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{recep.name}</p>
            <p className="text-xs text-gray-500">{recep.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (recep: User) => recep.phone || 'N/A' },
    { key: 'id', label: 'User ID', render: (recep: User) => <span className="font-mono text-xs">{recep.id}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (recep: User) => (
        <div className="flex gap-3">
          <button onClick={() => openDetails(recep)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View Details
          </button>
          <button onClick={() => handleDelete(recep.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
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
          <h2 className="text-2xl font-bold text-gray-800">Manage Receptionists</h2>
          <p className="text-gray-500 mt-1">View and manage receptionist staff</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Receptionist
        </button>
      </div>

      <DataTable columns={columns} data={receptionists} searchKeys={['name', 'email', 'phone']} />

      <Modal isOpen={!!selectedRecep} onClose={() => { setSelectedRecep(null); setIsEditing(false); }} title="Receptionist Details">
        {selectedRecep && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-700 font-bold text-2xl">
                {selectedRecep.name.charAt(0)}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className={inputCls} placeholder="Full Name" />
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-800">{selectedRecep.name}</h3>
                    <p className="text-gray-500">Role: {selectedRecep.role}</p>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Email</label><input value={editData.email || ''} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} className={inputCls} type="email" /></div>
                <div><label className={labelCls}>Phone</label><input value={editData.phone || ''} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} className={inputCls} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[{label:'Phone', val: selectedRecep.phone},{label:'Email', val: selectedRecep.email},{label:'User ID', val: selectedRecep.id}].map(item => (
                  <div key={item.label} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-sm">{item.val || 'N/A'}</p>
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
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">✏️ Edit Receptionist</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Add New Receptionist" size="md">
        <form onSubmit={handleAddRecep} className="space-y-4">
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
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Receptionist'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
