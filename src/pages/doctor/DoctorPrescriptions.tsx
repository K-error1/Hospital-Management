import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { prescriptions } from '../../data/mockData';
import { Prescription } from '../../types';

export default function DoctorPrescriptions() {
  const { user } = useAuth();
  const myPrescriptions = prescriptions.filter(p => p.doctorId === user?.id);
  const [selectedPresc, setSelectedPresc] = useState<Prescription | null>(null);

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
          <div key={presc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPresc(presc)}>
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
              {presc.medications.length > 2 && (
                <p className="text-xs text-gray-400 pl-4">+{presc.medications.length - 2} more</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedPresc} onClose={() => setSelectedPresc(null)} title="Prescription Details" size="lg">
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

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Diagnosis</h4>
              <p className="text-gray-800">{selectedPresc.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Medications</h4>
              <div className="space-y-3">
                {selectedPresc.medications.map((med, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-800">{med.name}</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Dosage</p>
                        <p className="text-sm font-medium">{med.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Frequency</p>
                        <p className="text-sm font-medium">{med.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium">{med.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPresc.notes && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                <p className="text-xs text-yellow-700 font-semibold mb-1">⚠️ Notes</p>
                <p className="text-sm text-gray-800">{selectedPresc.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
