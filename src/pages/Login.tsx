import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const roles: { role: UserRole; label: string; icon: JSX.Element; desc: string; demoEmail: string; color: string }[] = [
  { 
    role: 'administrator', 
    label: 'Administrator', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ), 
    desc: 'Full system access & management', 
    demoEmail: 'admin@medicare.co.ke',
    color: 'indigo'
  },
  { 
    role: 'doctor', 
    label: 'Doctor', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ), 
    desc: 'Patient care & prescriptions', 
    demoEmail: 'otieno@medicare.co.ke',
    color: 'emerald'
  },
  { 
    role: 'nurse', 
    label: 'Nurse', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ), 
    desc: 'Patient monitoring & care', 
    demoEmail: 'akinyi@medicare.co.ke',
    color: 'sky'
  },
  { 
    role: 'receptionist', 
    label: 'Receptionist', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ), 
    desc: 'Registration & appointments', 
    demoEmail: 'alice@medicare.co.ke',
    color: 'fuchsia'
  },
  { 
    role: 'patient', 
    label: 'Patient', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ), 
    desc: 'View records & appointments', 
    demoEmail: 'john@email.co.ke',
    color: 'amber'
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    const userData = await login(email, password);
    if (userData) {
      if (userData.must_change_password) {
        navigate('/change-password');
      } else {
        navigate(`/${selectedRole}`);
      }
    } else {
      setError('Login failed. Please check credentials.');
    }
  };

  const currentRole = roles.find(r => r.role === selectedRole);

  return (
    <div className="min-h-screen bg-[#0a1622] flex font-sans">
      {/* Left Sidebar - Role Selection */}
      <div className="w-[420px] border-r border-white/5 p-12 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-[#009b7d] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#009b7d]/20">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              Medi<span className="text-[#009b7d]">Care</span> HMS
            </h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">
              Hospital Management System
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8">
            Select Your Role
          </h2>

          <div className="space-y-4">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => handleRoleSelect(r.role)}
                className={`w-full group relative flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 text-left border ${
                  selectedRole === r.role
                    ? 'bg-white/[0.03] border-white/10 shadow-xl'
                    : 'bg-transparent border-transparent hover:bg-white/[0.01]'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  selectedRole === r.role 
                    ? 'bg-white/10 text-white' 
                    : 'bg-white/5 text-white/40 group-hover:text-white/60'
                }`}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold transition-colors ${
                    selectedRole === r.role ? 'text-white' : 'text-white/60'
                  }`}>
                    {r.label}
                  </h3>
                  <p className="text-[11px] text-white/40 mt-0.5">{r.desc}</p>
                </div>
                {selectedRole === r.role && (
                  <div className="w-6 h-6 rounded-full bg-[#009b7d]/20 border border-[#009b7d]/50 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#009b7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {/* Active Indicator Line */}
                {selectedRole === r.role && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-[#009b7d] rounded-r-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Login Form */}
      <div className="flex-1 bg-[#0a1622] flex flex-col justify-center px-24">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-serif text-white mb-2">Welcome back</h2>
          <p className="text-white/40 text-sm mb-10">
            Signing in as <span className="text-[#009b7d] font-medium">{currentRole?.label}</span>
          </p>

          <div className="mb-10 inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#009b7d]" />
            <p className="text-xs text-white/60">Role selected: {currentRole?.label}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.05] border-none rounded-xl px-6 py-4 text-white text-lg placeholder:text-white/10 focus:ring-1 focus:ring-white/10 transition-all outline-none"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <button type="button" className="text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-[0.1em]">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.05] border-none rounded-xl px-6 py-4 text-white text-lg placeholder:text-white/10 focus:ring-1 focus:ring-white/10 transition-all outline-none"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs px-1">{error}</p>
            )}

            <button
              type="submit"
              className="w-full border border-white/10 hover:bg-white/[0.02] text-white py-5 rounded-xl text-lg font-medium transition-all group flex items-center justify-center gap-3"
            >
              Sign in as {currentRole?.label}
              <svg className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
