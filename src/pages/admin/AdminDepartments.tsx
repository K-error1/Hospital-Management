import { useState, useEffect } from 'react';
import * as api from '../../utils/api';
import { Department } from '../../types';
import Modal from '../../components/ui/Modal';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [editData, setEditData] = useState<Partial<Department>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openEdit = (dept: Department) => { setEditDept(dept); setEditData({ ...dept }); };

  const handleSaveDept = async () => {
    if (!editDept) return;
    setIsSaving(true);
    try {
      await api.put('departments', editDept.id, editData);
      await loadData();
      setEditDept(null);
    } catch { alert('Failed to update department'); }
    finally { setIsSaving(false); }
  };

  const handleAddDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newDepartment = {
      id: `DEPT-${Date.now()}`,
      name: formData.get('name'),
      head: formData.get('head'),
      bedsTotal: Number(formData.get('bedsTotal')),
      doctorsCount: 0, nursesCount: 0, bedsOccupied: 0
    };
    try {
      await api.post('departments', newDepartment);
      await loadData();
      setIsAddModalOpen(false);
    } catch { alert('Failed to add department'); }
    finally { setIsSubmitting(false); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Departments...</p></div>;
  }

  const deptIcon = (name: string) => {
    const map: Record<string, string> = { Cardiology: '❤️', Neurology: '🧠', Orthopedics: '🦴', Pediatrics: '👶', Emergency: '🚑' };
    return map[name] || '🏥';
  };
  const deptBg = (name: string) => {
    const map: Record<string, string> = { Cardiology: 'bg-red-100', Neurology: 'bg-purple-100', Orthopedics: 'bg-blue-100', Pediatrics: 'bg-green-100', Emergency: 'bg-orange-100' };
    return map[name] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <p className="text-gray-500 mt-1">Manage hospital departments and resources</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map(dept => {
          const occupancyRate = dept.bedsTotal > 0 ? Math.round((dept.bedsOccupied / dept.bedsTotal) * 100) : 0;
          return (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                    <p className="text-sm text-gray-500">Head: {dept.head}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(dept)}
                      className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${deptBg(dept.name)}`}>
                      {deptIcon(dept.name)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-800">{dept.doctorsCount}</p>
                    <p className="text-xs text-gray-500">Doctors</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-800">{dept.nursesCount}</p>
                    <p className="text-xs text-gray-500">Nurses</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-800">{dept.bedsTotal}</p>
                    <p className="text-xs text-gray-500">Beds</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Bed Occupancy</span>
                    <span className={`font-semibold ${occupancyRate > 80 ? 'text-red-600' : occupancyRate > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {occupancyRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${occupancyRate > 80 ? 'bg-red-500' : occupancyRate > 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{dept.bedsOccupied} occupied / {dept.bedsTotal - dept.bedsOccupied} available</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Department Modal */}
      <Modal isOpen={!!editDept} onClose={() => setEditDept(null)} title="Edit Department" size="md">
        {editDept && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Department Name</label>
              <input value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Head of Department (HOD)</label>
              <input value={editData.head || ''} onChange={e => setEditData(d => ({ ...d, head: e.target.value }))} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Total Beds</label>
                <input type="number" min="0" value={editData.bedsTotal ?? ''} onChange={e => setEditData(d => ({ ...d, bedsTotal: Number(e.target.value) }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Beds Occupied</label>
                <input type="number" min="0" value={editData.bedsOccupied ?? ''} onChange={e => setEditData(d => ({ ...d, bedsOccupied: Number(e.target.value) }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Doctors Count</label>
                <input type="number" min="0" value={editData.doctorsCount ?? ''} onChange={e => setEditData(d => ({ ...d, doctorsCount: Number(e.target.value) }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nurses Count</label>
                <input type="number" min="0" value={editData.nursesCount ?? ''} onChange={e => setEditData(d => ({ ...d, nursesCount: Number(e.target.value) }))} className={inputCls} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setEditDept(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSaveDept} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Department Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Add New Department" size="md">
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <div>
            <label className={labelCls}>Department Name</label>
            <input required name="name" type="text" className={inputCls} placeholder="e.g. Cardiology" />
          </div>
          <div>
            <label className={labelCls}>Head of Department (HOD)</label>
            <input required name="head" type="text" className={inputCls} placeholder="e.g. Dr. Jane Smith" />
          </div>
          <div>
            <label className={labelCls}>Total Beds Capacity</label>
            <input required name="bedsTotal" type="number" min="0" className={inputCls} placeholder="e.g. 50" />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
