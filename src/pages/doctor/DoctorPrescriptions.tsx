import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Prescription } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

export default function DoctorPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresc, setSelectedPresc] = useState<Prescription | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Prescription>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openPresc = (p: Prescription) => {
    setSelectedPresc(p);
    setEditData({ ...p, medications: p.medications.map(m => ({ ...m })) });
    setIsEditing(false);
  };

  const updateMed = (index: number, field: string, value: string) => {
    setEditData(d => ({
      ...d,
      medications: (d.medications || []).map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  };

  const handleSave = async () => {
    if (!selectedPresc) return;
    setIsSaving(true);
    try {
      await api.put('prescriptions', selectedPresc.id, editData);
      await loadData();
      setIsEditing(false);
      setSelectedPresc(prev => prev ? { ...prev, ...editData } as Prescription : null);
    } catch { alert('Failed to update prescription'); }
    finally { setIsSaving(false); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Prescriptions...</p></div>;
  }

  const myPrescriptions = prescriptions.filter(p => p.doctorId === user?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
          <p className="text-gray-500 mt-1">Manage patient prescriptions</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
          + Write Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myPrescriptions.map(presc => (
          <div key={presc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openPresc(presc)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm">
                  {presc.patientName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{presc.patientName}</p>
                  <p className="text-xs text-gray-500">{presc.date}</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                {presc.medications.length} medications
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
              <p className="text-sm font-medium text-gray-800">{presc.diagnosis}</p>
            </div>
            <div className="space-y-1">
              {presc.medications.slice(0, 2).map((med, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-700">{med.name} - {med.dosage}</span>
                </div>
              ))}
              {presc.medications.length > 2 && <p className="text-xs text-gray-400 pl-4">+{presc.medications.length - 2} more</p>}
            </div>
          </div>
        ))}
        {myPrescriptions.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-3">💊</p>
            <p className="text-gray-500">No prescriptions written yet</p>
          </div>
        )}
      </div>

      {/* View / Edit Prescription Modal */}
      <Modal isOpen={!!selectedPresc} onClose={() => { setSelectedPresc(null); setIsEditing(false); }} title="Prescription Details" size="lg">
        {selectedPresc && (
          <div className="space-y-5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">{selectedPresc.patientName}</p>
                  <p className="text-sm text-gray-500">Prescribed on {selectedPresc.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Prescriber</p>
                  <p className="font-medium text-gray-800">{selectedPresc.doctorName}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Diagnosis</h4>
              {isEditing ? (
                <input value={editData.diagnosis || ''} onChange={e => setEditData(d => ({ ...d, diagnosis: e.target.value }))} className={inputCls} />
              ) : (
                <p className="text-gray-800">{selectedPresc.diagnosis}</p>
              )}
            </div>

            {/* Medications */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Medications</h4>
              <div className="space-y-3">
                {(isEditing ? editData.medications : selectedPresc.medications)?.map((med, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className={labelCls}>Drug Name</label>
                          <input value={med.name} onChange={e => updateMed(i, 'name', e.target.value)} className={inputCls} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className={labelCls}>Dosage</label>
                            <input value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Frequency</label>
                            <input value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Duration</label>
                            <input value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)} className={inputCls} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800">{med.name}</p>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div><p className="text-xs text-gray-500">Dosage</p><p className="text-sm font-medium">{med.dosage}</p></div>
                          <div><p className="text-xs text-gray-500">Frequency</p><p className="text-sm font-medium">{med.frequency}</p></div>
                          <div><p className="text-xs text-gray-500">Duration</p><p className="text-sm font-medium">{med.duration}</p></div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Notes</h4>
              {isEditing ? (
                <textarea value={editData.notes || ''} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Clinical notes..." />
              ) : (
                selectedPresc.notes ? (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <p className="text-xs text-yellow-700 font-semibold mb-1">⚠️ Notes</p>
                    <p className="text-sm text-gray-800">{selectedPresc.notes}</p>
                  </div>
                ) : <p className="text-gray-400 text-sm italic">No notes</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Prescription'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                  ✏️ Edit Prescription
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
