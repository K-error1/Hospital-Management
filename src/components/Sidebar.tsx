import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: Record<UserRole, NavItem[]> = {
  administrator: [
    { label: 'Dashboard', path: '/administrator', icon: '📊' },
    { label: 'Doctors', path: '/administrator/doctors', icon: '👨‍⚕️' },
    { label: 'Nurses', path: '/administrator/nurses', icon: '👩‍⚕️' },
    { label: 'Receptionists', path: '/administrator/receptionists', icon: '📝' },
    { label: 'Patients', path: '/administrator/patients', icon: '🏥' },
    { label: 'Departments', path: '/administrator/departments', icon: '🏢' },
    { label: 'Appointments', path: '/administrator/appointments', icon: '📅' },
    { label: 'Billing', path: '/administrator/billing', icon: '💰' },
    { label: 'Reports', path: '/administrator/reports', icon: '📈' },
    { label: 'Audit Logs', path: '/administrator/audit', icon: '🛡️' },
  ],
  doctor: [
    { label: 'Dashboard', path: '/doctor', icon: '📊' },
    { label: 'My Patients', path: '/doctor/patients', icon: '🏥' },
    { label: 'Appointments', path: '/doctor/appointments', icon: '📅' },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: '💊' },
    { label: 'Schedule', path: '/doctor/schedule', icon: '🗓️' },
  ],
  nurse: [
    { label: 'Dashboard', path: '/nurse', icon: '📊' },
    { label: 'My Patients', path: '/nurse/patients', icon: '🏥' },
    { label: 'Vital Signs', path: '/nurse/vitals', icon: '❤️' },
    { label: 'Medications', path: '/nurse/medications', icon: '💊' },
    { label: 'Ward Info', path: '/nurse/ward', icon: '🛏️' },
  ],
  patient: [
    { label: 'Dashboard', path: '/patient', icon: '📊' },
    { label: 'Appointments', path: '/patient/appointments', icon: '📅' },
    { label: 'Medical Records', path: '/patient/records', icon: '📋' },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: '💊' },
    { label: 'Billing', path: '/patient/billing', icon: '💰' },
  ],
  receptionist: [
    { label: 'Dashboard', path: '/receptionist', icon: '📊' },
    { label: 'Patients', path: '/receptionist/patients', icon: '🏥' },
    { label: 'Appointments', path: '/receptionist/appointments', icon: '📅' },
  ],
};

const roleColors: Record<UserRole, string> = {
  administrator: 'from-indigo-700 to-indigo-900',
  doctor: 'from-emerald-700 to-emerald-900',
  nurse: 'from-sky-700 to-sky-900',
  patient: 'from-violet-700 to-violet-900',
  receptionist: 'from-fuchsia-700 to-fuchsia-900',
};

const roleLabels: Record<UserRole, string> = {
  administrator: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  patient: 'Patient',
  receptionist: 'Receptionist',
};

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = navItems[user.role];
  const gradient = roleColors[user.role];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b ${gradient} text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">🏥</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">MediCare</h1>
              <p className="text-xs text-white/70">Hospital Management</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-white/60">{roleLabels[user.role]}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === `/${user.role}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <span className="text-lg">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
