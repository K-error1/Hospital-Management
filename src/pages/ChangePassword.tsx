import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword === oldPassword) {
      setError('New password must be different from the current one');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(oldPassword, newPassword, confirmPassword);
      navigate(`/${user?.role}`);
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1622] flex font-sans items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#009b7d]/10 border border-[#009b7d]/30 rounded-2xl flex items-center justify-center text-[#009b7d] mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-white mb-2">Change Password</h1>
          <p className="text-white/40 text-sm">
            For security reasons, you must change your temporary password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-white/[0.05] border-none rounded-xl px-5 py-3.5 text-white placeholder:text-white/10 focus:ring-1 focus:ring-white/10 transition-all outline-none"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/[0.05] border-none rounded-xl px-5 py-3.5 text-white placeholder:text-white/10 focus:ring-1 focus:ring-white/10 transition-all outline-none"
              placeholder="••••••••••••"
              required
            />
            <p className="text-[10px] text-white/20 ml-1">Minimum 8 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/[0.05] border-none rounded-xl px-5 py-3.5 text-white placeholder:text-white/10 focus:ring-1 focus:ring-white/10 transition-all outline-none"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#009b7d] hover:bg-[#008b6d] text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#009b7d]/20"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full text-white/20 hover:text-white/40 text-xs transition-colors uppercase tracking-[0.1em]"
          >
            Cancel and Log out
          </button>
        </form>
      </div>
    </div>
  );
}
