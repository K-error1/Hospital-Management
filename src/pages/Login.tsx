import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const roles: { role: UserRole; label: string; icon: string; color: string; desc: string; demoEmail: string }[] = [
  { role: 'administrator', label: 'Administrator', icon: '🛡️', color: 'from-indigo-500 to-indigo-700', desc: 'Full system access & management', demoEmail: 'admin@medicare.com' },
  { role: 'doctor', label: 'Doctor', icon: '👨‍⚕️', color: 'from-emerald-500 to-emerald-700', desc: 'Patient care & prescriptions', demoEmail: 'wilson@medicare.com' },
  { role: 'nurse', label: 'Nurse', icon: '👩‍⚕️', color: 'from-sky-500 to-sky-700', desc: 'Patient monitoring & care', demoEmail: 'anderson@medicare.com' },
  { role: 'patient', label: 'Patient', icon: '🙋', color: 'from-violet-500 to-violet-700', desc: 'View records & appointments', demoEmail: 'john@email.com' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    const success = login(email, selectedRole);
    if (success) {
      navigate(`/${selectedRole}`);
    } else {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border border-white/20">
              🏥
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white">MediCare HMS</h1>
              <p className="text-indigo-300 text-sm">Hospital Management System</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-md mx-auto">Select your role and sign in to access the hospital management dashboard</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleSelect(r.role, r.demoEmail)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                selectedRole === r.role
                  ? 'border-white/40 bg-white/10 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {r.icon}
              </div>
              <h3 className="text-white font-semibold text-sm">{r.label}</h3>
              <p className="text-gray-400 text-xs mt-1">{r.desc}</p>
              {selectedRole === r.role && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                defaultValue="demo123"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
            >
              Sign In {selectedRole ? `as ${roles.find(r => r.role === selectedRole)?.label}` : ''}
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">Demo: Select a role and click Sign In</p>
        </form>
      </div>
    </div>
  );
}
