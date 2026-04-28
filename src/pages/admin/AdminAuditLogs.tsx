import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

// Mock data since we don't have a backend endpoint for audit logs yet
const MOCK_LOGS: AuditLog[] = [
  { id: 'LOG-1', user: 'Admin User', role: 'administrator', action: 'Login', details: 'Successful login', timestamp: '2026-04-28 09:00:00' },
  { id: 'LOG-2', user: 'Receptionist Jane', role: 'receptionist', action: 'Create Patient', details: 'Registered new patient John Doe', timestamp: '2026-04-28 09:15:30' },
  { id: 'LOG-3', user: 'Dr. Smith', role: 'doctor', action: 'Update Diagnosis', details: 'Updated diagnosis for John Doe', timestamp: '2026-04-28 10:20:10' },
  { id: 'LOG-4', user: 'Nurse Mary', role: 'nurse', action: 'Record Vitals', details: 'Recorded vitals for John Doe', timestamp: '2026-04-28 11:05:45' },
  { id: 'LOG-5', user: 'Admin User', role: 'administrator', action: 'Export Report', details: 'Exported hospital analytics to PDF', timestamp: '2026-04-28 11:30:00' },
];

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching
    setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Audit Logs...</p></div>;
  }

  const columns = [
    { key: 'timestamp', label: 'Timestamp', render: (l: AuditLog) => <span className="text-xs text-gray-500">{l.timestamp}</span> },
    { key: 'user', label: 'User', render: (l: AuditLog) => <span className="font-medium">{l.user}</span> },
    { key: 'role', label: 'Role', render: (l: AuditLog) => <span className="capitalize text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">{l.role}</span> },
    { key: 'action', label: 'Action', render: (l: AuditLog) => <span className="font-semibold text-indigo-700">{l.action}</span> },
    { key: 'details', label: 'Details' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">System Audit Logs</h2>
        <p className="text-gray-500 mt-1">Monitor all user activities and system events</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-2xl">
          🛡️
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Security Events</p>
          <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} searchKeys={['user', 'action', 'details', 'role']} />
    </div>
  );
}
