import { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { patients, doctors, vitalSigns } from '../../data/mockData';
import { Patient } from '../../types';

export default function NursePatients() {
  const { user } = useAuth();
  const myPatients = patients.filter(p => p.assignedNurse === user?.id);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
            }`} onClick={() => setSelectedPatient(p)}>
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
      </div>

      <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title="Patient Details" size="lg">
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-xl">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedPatient.name}</h3>
                <p className="text-gray-500">{selectedPatient.age}y • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}</p>
                <StatusBadge status={selectedPatient.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Room</p><p className="font-medium">{selectedPatient.room || 'N/A'}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Doctor</p><p className="font-medium">{getDoctorName(selectedPatient.assignedDoctor)}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Diagnosis</p><p className="font-medium">{selectedPatient.diagnosis}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Admitted</p><p className="font-medium">{selectedPatient.admissionDate}</p></div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Vital Signs History</h4>
              <div className="space-y-2">
                {getPatientVitals(selectedPatient.id).map(v => (
                  <div key={v.id} className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-2">{v.date} at {v.time}</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Temp</p>
                        <p className="font-bold text-sm">{v.temperature}°F</p>
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
          </div>
        )}
      </Modal>
    </div>
  );
}
