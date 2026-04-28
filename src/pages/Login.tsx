import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
const roles: { role: UserRole; label: string; icon: string; color: string; desc: string; demoEmail: string }[] = [
  { role: 'administrator', label: 'Administrator', icon: '🛡️', color: 'from-indigo-500 to-indigo-700', desc: 'Full system access & management', demoEmail: 'admin@medicare.co.ke' },
  { role: 'doctor', label: 'Doctor', icon: '👨‍⚕️', color: 'from-emerald-500 to-emerald-700', desc: 'Patient care & prescriptions', demoEmail: 'otieno@medicare.co.ke' },
  { role: 'nurse', label: 'Nurse', icon: '👩‍⚕️', color: 'from-sky-500 to-sky-700', desc: 'Patient monitoring & care', demoEmail: 'akinyi@medicare.co.ke' },
  { role: 'receptionist', label: 'Receptionist', icon: '📝', color: 'from-fuchsia-500 to-fuchsia-700', desc: 'Patient registration & appointments', demoEmail: 'alice@medicare.co.ke' },
  { role: 'patient', label: 'Patient', icon: '🙋', color: 'from-violet-500 to-violet-700', desc: 'View records & appointments', demoEmail: 'john@email.co.ke' },
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    const password = (e.target as any)[1].value;
    const success = await login(email, password);
    if (success) {
      navigate(`/${selectedRole}`);
    } else {
      setError('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/30 mix-blend-screen filter blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/30 mix-blend-screen filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-violet-500/30 mix-blend-screen filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative w-full max-w-4xl z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl border border-white/20 shadow-xl shadow-black/20">
              🏥
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-sm tracking-tight">MediCare HMS</h1>
              <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase mt-1">Hospital Management System</p>
            </div>
          </div>
          <p className="text-indigo-100/80 max-w-md mx-auto text-sm">Select your role and sign in to access the hospital management dashboard</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleSelect(r.role, r.demoEmail)}
              className={`relative p-5 rounded-2xl border transition-all duration-500 text-left group overflow-hidden ${
                selectedRole === r.role
                  ? 'border-white/50 bg-white/20 shadow-2xl shadow-black/30 scale-[1.05] -translate-y-1'
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20'
              } backdrop-blur-md`}
            >
              {/* Highlight gradient for selected state */}
              {selectedRole === r.role && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              )}
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                {r.icon}
              </div>
              <h3 className="text-white font-bold text-sm tracking-wide">{r.label}</h3>
              <p className="text-white/60 text-xs mt-1.5 leading-relaxed">{r.desc}</p>
              
              {/* Checkmark for selection */}
              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedRole === r.role ? 'bg-gradient-to-r from-green-400 to-emerald-500 scale-100 opacity-100 shadow-lg shadow-green-500/30' : 'scale-0 opacity-0'
              }`}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md mx-auto shadow-2xl shadow-black/40 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-indigo-100 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 shadow-inner"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-indigo-100 uppercase tracking-wider mb-2 ml-1">Password</label>
              <input
                type="password"
                defaultValue="password123"
                className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 shadow-inner"
                placeholder="Enter your password"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg animate-fade-in">
                <p className="text-red-200 text-sm flex items-center gap-2">
                  <span className="text-red-400">⚠️</span> {error}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In {selectedRole ? `as ${roles.find(r => r.role === selectedRole)?.label}` : ''}
            </button>
          </div>
          <p className="text-center text-white/40 text-xs mt-6 tracking-wide">Select a role and click Sign In to continue</p>
        </form>
      </div>
    </div>
  );
}
