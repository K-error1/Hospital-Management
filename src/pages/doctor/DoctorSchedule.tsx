import { useState, useEffect } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Appointment } from '../../types';

export default function DoctorSchedule() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.fetchAppointments();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Schedule...</p></div>;
  }

  const myAppointments = appointments.filter(a => a.doctorId === user?.id);
  const today = new Date().toISOString().split('T')[0];

  const groupedByDate = myAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {} as Record<string, typeof myAppointments>);

  const sortedDates = Object.keys(groupedByDate).sort();

  const dayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const timeSlots = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Schedule</h2>
        <p className="text-gray-500 mt-1">View your upcoming schedule</p>
      </div>

      {/* Weekly Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Weekly Overview</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDates.map(date => (
              <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100">
                  <p className="font-semibold text-emerald-800">{dayOfWeek(date)}</p>
                  <p className="text-sm text-emerald-600">{date}</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {groupedByDate[date]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(apt => (
                      <div key={apt.id} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-emerald-700">{apt.time}</span>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-sm font-medium text-gray-800">{apt.patientName}</p>
                        <p className="text-xs text-gray-500">{apt.type}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {sortedDates.length === 0 && (
              <div className="col-span-3 p-8 text-center text-gray-400">No appointments scheduled</div>
            )}
          </div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Available Time Slots (Today — {today})</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {timeSlots.map(slot => {
              const isBooked = myAppointments.some(a => a.date === today && a.time === slot);
              return (
                <div key={slot} className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  isBooked
                    ? 'bg-red-50 border-red-200 text-red-600 line-through'
                    : 'bg-green-50 border-green-200 text-green-700 cursor-pointer hover:bg-green-100'
                }`}>
                  {slot} {isBooked ? '(Booked)' : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
