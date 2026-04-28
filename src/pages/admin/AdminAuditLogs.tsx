import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import * as api from '../../utils/api';
import { AuditLog } from '../../types';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await api.fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Audit Logs...</p></div>;
  }

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString('en-KE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const columns = [
    { 
      key: 'timestamp', 
      label: 'Timestamp', 
      render: (l: AuditLog) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{formatTimestamp(l.timestamp)}</span>
          <span className="text-[10px] text-gray-400 font-mono italic">Ref: #{l.id}</span>
        </div>
      ) 
    },
    { 
      key: 'user', 
      label: 'User', 
      render: (l: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
            {l.user.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">{l.user}</span>
        </div>
      ) 
    },
    { 
      key: 'role', 
      label: 'Role', 
      render: (l: AuditLog) => (
        <span className="capitalize text-[10px] px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-gray-600 font-medium tracking-wide">
          {l.role}
        </span>
      ) 
    },
    { 
      key: 'action', 
      label: 'Action', 
      render: (l: AuditLog) => {
        const isSecurity = l.action.includes('Login') || l.action.includes('Password');
        return (
          <span className={`font-semibold ${isSecurity ? 'text-red-600' : 'text-indigo-700'}`}>
            {l.action}
          </span>
        );
      } 
    },
    { 
      key: 'details', 
      label: 'Details',
      render: (l: AuditLog) => <span className="text-sm text-gray-600 line-clamp-1 hover:line-clamp-none transition-all cursor-default">{l.details}</span>
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Audit Logs</h2>
          <p className="text-gray-500 mt-1">Monitor all user activities and system events</p>
        </div>
        <button 
          onClick={() => { setLoading(true); loadData(); }}
          className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
        >
          🔄 Refresh Logs
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-2xl shadow-inner border border-indigo-100">
          🛡️
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Recorded Events</p>
          <p className="text-3xl font-black text-gray-800 leading-tight">{logs.length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} searchKeys={['user', 'action', 'details', 'role']} />
    </div>
  );
}
