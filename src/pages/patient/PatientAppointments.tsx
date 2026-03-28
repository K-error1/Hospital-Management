import { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { appointments, doctors } from '../../data/mockData';

export default function PatientAppointments() {
  const { user } = useAuth();
  const myAppointments = appointments.filter(a => a.patientId === user?.id);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
          <p className="text-gray-500 mt-1">View and manage your appointments</p>
        </div>
        <button onClick={() => setShowBooking(true)} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm">
          + Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myAppointments.map(apt => (
          <div key={apt.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
            apt.status === 'Scheduled' ? 'border-blue-200' :
            apt.status === 'Completed' ? 'border-green-200' :
            'border-gray-100'
          }`}>
            <div className={`px-4 py-2 flex items-center justify-between ${
              apt.status === 'Scheduled' ? 'bg-blue-50' :
              apt.status === 'Completed' ? 'bg-green-50' :
              'bg-gray-50'
            }`}>
              <span className="text-sm font-medium text-gray-700">{apt.date}</span>
              <StatusBadge status={apt.status} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                  {apt.doctorName.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{apt.doctorName}</p>
                  <p className="text-sm text-gray-500">{apt.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>🕐 {apt.time}</span>
                <span>📋 {apt.type}</span>
              </div>
              {apt.notes && (
                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">📝 {apt.notes}</p>
              )}
              {apt.status === 'Scheduled' && (
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-200">
                    Reschedule
                  </button>
                  <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showBooking} onClose={() => setShowBooking(false)} title="Book New Appointment">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
              <option value="">Choose a doctor...</option>
              {doctors.filter(d => d.status !== 'On Leave').map(d => (
                <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
              <option value="">Select type...</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
                <option>09:00</option><option>09:30</option><option>10:00</option><option>10:30</option>
                <option>11:00</option><option>14:00</option><option>14:30</option><option>15:00</option>
                <option>15:30</option><option>16:00</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
            <textarea rows={3} placeholder="Briefly describe your concern..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowBooking(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={() => setShowBooking(false)} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
              Book Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
