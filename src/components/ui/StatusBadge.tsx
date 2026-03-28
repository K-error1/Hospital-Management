const statusColors: Record<string, string> = {
  // Patient status
  'Admitted': 'bg-blue-100 text-blue-700',
  'Outpatient': 'bg-green-100 text-green-700',
  'Discharged': 'bg-gray-100 text-gray-700',
  'Critical': 'bg-red-100 text-red-700',
  // Doctor status
  'Available': 'bg-green-100 text-green-700',
  'In Surgery': 'bg-orange-100 text-orange-700',
  'On Leave': 'bg-gray-100 text-gray-600',
  'Busy': 'bg-yellow-100 text-yellow-700',
  // Nurse status
  'On Duty': 'bg-green-100 text-green-700',
  'Off Duty': 'bg-gray-100 text-gray-600',
  // Appointment status
  'Scheduled': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  // Billing status
  'Paid': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Overdue': 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
}
