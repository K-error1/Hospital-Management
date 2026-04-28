import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Prescription } from '../../types';

export default function PatientPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresc, setSelectedPresc] = useState<Prescription | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.fetchPrescriptions();
        setPrescriptions(data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Prescriptions...</p></div>;
  }

  const myPrescriptions = prescriptions.filter(p => p.patientId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Prescriptions</h2>
        <p className="text-gray-500 mt-1">View your medication prescriptions</p>
      </div>

      {myPrescriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">💊</p>
          <p className="text-gray-500">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myPrescriptions.map(presc => (
            <div key={presc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPresc(presc)}>
              <div className="bg-violet-50 px-5 py-3 border-b border-violet-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-violet-800">{presc.doctorName}</p>
                  <p className="text-sm text-violet-600">Prescribed on {presc.date}</p>
                </div>
                <span className="bg-violet-200 text-violet-800 text-xs font-medium px-3 py-1 rounded-full">
                  {presc.medications.length} medications
                </span>
              </div>
              <div className="p-5">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
                  <p className="font-medium text-gray-800">{presc.diagnosis}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {presc.medications.map((med, i) => (
                    <div key={i} className="bg-violet-50 border border-violet-100 rounded-lg p-3">
                      <p className="font-semibold text-gray-800 text-sm">{med.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{med.dosage} • {med.frequency}</p>
                      <p className="text-xs text-gray-500">Duration: {med.duration}</p>
                    </div>
                  ))}
                </div>
                {presc.notes && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">⚠️ {presc.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedPresc} onClose={() => setSelectedPresc(null)} title="Prescription Details" size="lg">
        {selectedPresc && (
          <div className="space-y-5">
            <div className="bg-violet-50 border border-violet-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600">Prescribed by</p>
                <p className="font-bold text-gray-800">{selectedPresc.doctorName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-violet-600">Date</p>
                <p className="font-bold text-gray-800">{selectedPresc.date}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Diagnosis</h4>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedPresc.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Medications</h4>
              <div className="space-y-3">
                {selectedPresc.medications.map((med, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💊</span>
                      <p className="font-bold text-gray-800">{med.name}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Dosage</p>
                        <p className="text-sm font-medium">{med.dosage}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Frequency</p>
                        <p className="text-sm font-medium">{med.frequency}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium">{med.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPresc.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Important Notes</p>
                <p className="text-sm text-yellow-700">{selectedPresc.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
