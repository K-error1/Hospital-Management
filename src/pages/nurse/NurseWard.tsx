import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { Nurse, Patient, Department } from '../../types';
import StatusBadge from '../../components/ui/StatusBadge';

export default function NurseWard() {
  const { user } = useAuth();
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [nData, pData, dData] = await Promise.all([
          api.fetchNurses(),
          api.fetchPatients(),
          api.fetchDepartments(),
        ]);
        setNurses(nData);
        setPatients(pData);
        setDepartments(dData);
      } catch (err) {
        console.error('Error fetching ward data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Ward Information...</p></div>;
  }

  const nurseInfo = nurses.find(n => n.id === user?.id);
  const dept = departments.find(d => d.name === nurseInfo?.department);
  const wardPatients = patients.filter(p => p.assignedNurse === user?.id && (p.status === 'Admitted' || p.status === 'Critical'));

  const roomGrid = [
    { room: '301-A', floor: '3rd Floor', type: 'General' },
    { room: '301-B', floor: '3rd Floor', type: 'General' },
    { room: '302-A', floor: '3rd Floor', type: 'General' },
    { room: '302-B', floor: '3rd Floor', type: 'Semi-Private' },
    { room: '205-B', floor: '2nd Floor', type: 'General' },
    { room: 'ICU-1', floor: 'ICU', type: 'Intensive Care' },
    { room: 'ICU-2', floor: 'ICU', type: 'Intensive Care' },
    { room: 'ICU-3', floor: 'ICU', type: 'Intensive Care' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ward Information</h2>
        <p className="text-gray-500 mt-1">{nurseInfo?.assignedWard} • {nurseInfo?.department} Department</p>
      </div>

      {/* Ward Stats */}
      {dept && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Department Overview - {dept.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-sky-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-sky-700">{dept.bedsTotal}</p>
              <p className="text-xs text-sky-600">Total Beds</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{dept.bedsTotal - dept.bedsOccupied}</p>
              <p className="text-xs text-green-600">Available</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-700">{dept.bedsOccupied}</p>
              <p className="text-xs text-orange-600">Occupied</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-700">{dept.bedsTotal > 0 ? Math.round((dept.bedsOccupied / dept.bedsTotal) * 100) : 0}%</p>
              <p className="text-xs text-purple-600">Occupancy Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Room Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Room Map</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {roomGrid.map(room => {
            const occupant = wardPatients.find(p => p.room === room.room);
            return (
              <div key={room.room} className={`border-2 rounded-lg p-3 ${
                occupant
                  ? occupant.status === 'Critical'
                    ? 'border-red-300 bg-red-50'
                    : 'border-blue-300 bg-blue-50'
                  : 'border-green-300 bg-green-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{room.room}</span>
                  <span className={`w-3 h-3 rounded-full ${occupant ? occupant.status === 'Critical' ? 'bg-red-500' : 'bg-blue-500' : 'bg-green-500'}`} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{room.type}</p>
                {occupant ? (
                  <div>
                    <p className="text-sm font-medium text-gray-800">{occupant.name}</p>
                    <StatusBadge status={occupant.status} />
                  </div>
                ) : (
                  <p className="text-sm text-green-600 font-medium">Available</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" /> Available</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> Occupied</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Critical</div>
        </div>
      </div>

      {/* On-Duty Staff */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Nursing Staff on Duty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nurses.filter(n => n.status === 'On Duty').map(n => (
            <div key={n.id} className={`p-3 rounded-lg border ${n.id === user?.id ? 'border-sky-300 bg-sky-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-sm">
                  {n.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{n.name} {n.id === user?.id ? '(You)' : ''}</p>
                  <p className="text-xs text-gray-500">{n.assignedWard} • {n.shift}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
