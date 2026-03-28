import { departments } from '../../data/mockData';

export default function AdminDepartments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <p className="text-gray-500 mt-1">Manage hospital departments and resources</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map(dept => {
          const occupancyRate = Math.round((dept.bedsOccupied / dept.bedsTotal) * 100);
          return (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                    <p className="text-sm text-gray-500">Head: {dept.head}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    dept.name === 'Cardiology' ? 'bg-red-100' :
                    dept.name === 'Neurology' ? 'bg-purple-100' :
                    dept.name === 'Orthopedics' ? 'bg-blue-100' :
                    dept.name === 'Pediatrics' ? 'bg-green-100' :
                    dept.name === 'Emergency' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    {dept.name === 'Cardiology' ? '❤️' :
                     dept.name === 'Neurology' ? '🧠' :
                     dept.name === 'Orthopedics' ? '🦴' :
                     dept.name === 'Pediatrics' ? '👶' :
                     dept.name === 'Emergency' ? '🚑' :
                     '🏥'}
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
                      className={`h-2.5 rounded-full transition-all ${
                        occupancyRate > 80 ? 'bg-red-500' : occupancyRate > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`}
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
    </div>
  );
}
