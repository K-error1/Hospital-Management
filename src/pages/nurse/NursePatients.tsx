import { useState, useEffect } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Patient, Doctor, VitalSign, Prescription } from '../../types';

export default function NursePatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Patient>>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const [pData, dData, vData, prData] = await Promise.all([
        api.fetchPatients(),
        api.fetchDoctors(),
        api.fetchVitals(),
        api.fetchPrescriptions(),
      ]);
      setPatients(pData);
      setDoctors(dData);
      setVitalSigns(vData);
      setPrescriptions(prData);
    } catch (err) {
      console.error('Error fetching nurse patients data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDetails = (p: Patient) => {
    setSelectedPatient(p);
    setEditData(p);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    try {
      await api.put('patients', selectedPatient.id, editData);
      await loadData();
      setSelectedPatient({ ...selectedPatient, ...editData } as Patient);
      setIsEditing(false);
    } catch {
      alert('Failed to update patient');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Patients...</p></div>;
  }

  const myPatients = patients.filter(p => p.assignedNurse === user?.id);
  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'N/A';
  const getPatientVitals = (id: string) => vitalSigns.filter(v => v.patientId === id).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
        <p className="text-gray-500 mt-1">Patients assigned to your care</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myPatients.map(p => {
          const latestVitals = getPatientVitals(p.id)[0];
          return (
            <div key={p.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
              p.status === 'Critical' ? 'border-red-200' : 'border-gray-100'
            }`} onClick={() => openDetails(p)}>
              <div className={`px-4 py-2 ${p.status === 'Critical' ? 'bg-red-50' : 'bg-gray-50'} flex items-center justify-between`}>
                <span className="text-sm font-medium text-gray-600">Room: {p.room || 'N/A'}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    p.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.age}y • {p.gender} • {p.bloodGroup}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">📋 {p.diagnosis}</p>
                <p className="text-sm text-gray-500 mb-3">👨‍⚕️ {getDoctorName(p.assignedDoctor)}</p>
                {latestVitals && (
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center bg-gray-50 rounded p-1.5">
                      <p className="text-[10px] text-gray-500">Temp</p>
                      <p className="text-xs font-bold">{latestVitals.temperature}°</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded p-1.5">
                      <p className="text-[10px] text-gray-500">BP</p>
                      <p className="text-xs font-bold">{latestVitals.bloodPressure}</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded p-1.5">
                      <p className="text-[10px] text-gray-500">HR</p>
                      <p className="text-xs font-bold">{latestVitals.heartRate}</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded p-1.5">
                      <p className="text-[10px] text-gray-500">SpO2</p>
                      <p className="text-xs font-bold">{latestVitals.oxygenLevel}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {myPatients.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-400">No patients assigned to you.</p>
          </div>
        )}
      </div>

    <Modal isOpen={!!selectedPatient} onClose={() => { setSelectedPatient(null); setIsEditing(false); }} title="Patient Details" size="lg">
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-xl">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{selectedPatient.name}</h3>
                <p className="text-gray-500">{selectedPatient.age}y • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}</p>
                {!isEditing && <StatusBadge status={selectedPatient.status} />}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Room</label>
                  <input value={editData.room || ''} onChange={e => setEditData(d => ({ ...d, room: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as Patient['status'] }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="Admitted">Admitted</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Critical">Critical</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-2">
                  <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 relative group">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Room</p><p className="font-medium">{selectedPatient.room || 'N/A'}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Doctor</p><p className="font-medium">{getDoctorName(selectedPatient.assignedDoctor)}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Diagnosis</p><p className="font-medium">{selectedPatient.diagnosis}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Admitted</p><p className="font-medium">{selectedPatient.admissionDate}</p></div>
                <button onClick={() => setIsEditing(true)} className="absolute top-2 right-2 text-sky-600 hover:text-sky-800 text-sm font-medium bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  ✏️ Edit Info
                </button>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Vital Signs History</h4>
              <div className="space-y-2">
                {getPatientVitals(selectedPatient.id).map(v => (
                  <div key={v.id} className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-2">{v.date} at {v.time}</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Temp</p>
                        <p className="font-bold text-sm">{v.temperature}°C</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">BP</p>
                        <p className="font-bold text-sm">{v.bloodPressure}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">HR</p>
                        <p className="font-bold text-sm">{v.heartRate} bpm</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">SpO2</p>
                        <p className="font-bold text-sm">{v.oxygenLevel}%</p>
                      </div>
                    </div>
                    {v.notes && <p className="text-xs text-orange-600 mt-2">⚠️ {v.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Record Vitals</h4>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const newVitals = {
                  id: `vital-${Date.now()}`,
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                  nurseId: user?.id || 'nurse-1',
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  temperature: Number(form[0].value),
                  bloodPressure: form[1].value,
                  heartRate: Number(form[2].value),
                  oxygenLevel: Number(form[3].value),
                  weight: form[4].value ? Number(form[4].value) : undefined,
                  notes: form[5].value || null
                };
                try {
                  await api.post('vitals', newVitals);
                  loadData();
                  form.reset();
                } catch(err) { alert('Failed to record vitals'); }
              }} className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <input required placeholder="Temp (°C)" type="number" step="0.1" className="border rounded-lg px-3 py-2 text-sm" />
                  <input required placeholder="BP (e.g. 120/80)" className="border rounded-lg px-3 py-2 text-sm" />
                  <input required placeholder="HR (bpm)" type="number" className="border rounded-lg px-3 py-2 text-sm" />
                  <input required placeholder="SpO2 (%)" type="number" className="border rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Weight (kg) - Opt" type="number" step="0.1" className="border rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Notes - Opt" className="border rounded-lg px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="w-full bg-sky-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-sky-700">Save Vitals</button>
              </form>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Administer Medication</h4>
              <div className="space-y-2">
                {prescriptions.filter(p => p.patientId === selectedPatient.id).length === 0 ? (
                  <p className="text-sm text-gray-500">No active prescriptions for this patient.</p>
                ) : (
                  prescriptions.filter(p => p.patientId === selectedPatient.id).map(presc => (
                    <div key={presc.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <p className="text-sm font-medium text-violet-800">Prescribed: {presc.date}</p>
                      {presc.medications.map((med, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-semibold">{med.name}</span>
                            <span className="text-gray-500 ml-2">{med.dosage} • {med.frequency}</span>
                          </div>
                          <button
                            onClick={async () => {
                              const note = `Administered Medication: ${med.name} (${med.dosage})`;
                              const latest = getPatientVitals(selectedPatient.id)[0];
                              const newVitals = {
                                id: `vital-${Date.now()}`,
                                patientId: selectedPatient.id,
                                patientName: selectedPatient.name,
                                nurseId: user?.id || 'nurse-1',
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                temperature: latest ? latest.temperature : 37.0,
                                bloodPressure: latest ? latest.bloodPressure : '120/80',
                                heartRate: latest ? latest.heartRate : 80,
                                oxygenLevel: latest ? latest.oxygenLevel : 98,
                                notes: note
                              };
                              try {
                                await api.post('vitals', newVitals);
                                alert(`Successfully logged administration of ${med.name}`);
                                loadData();
                              } catch(err) { alert('Failed to log medication'); }
                            }}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded text-xs font-semibold"
                          >
                            Mark Administered
                          </button>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
