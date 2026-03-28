import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import StatCard from '../../components/ui/StatCard';
import { billingRecords } from '../../data/mockData';
import { BillingRecord } from '../../types';
import { useState } from 'react';
import Modal from '../../components/ui/Modal';

export default function AdminBilling() {
  const [selectedBill, setSelectedBill] = useState<BillingRecord | null>(null);

  const totalRevenue = billingRecords.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingAmount = billingRecords.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.totalAmount, 0);
  const paidAmount = billingRecords.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const insuranceCovered = billingRecords.reduce((sum, b) => sum + b.insuranceCovered, 0);

  const columns = [
    { key: 'id', label: 'Bill ID', render: (b: BillingRecord) => <span className="font-mono text-xs text-gray-500">{b.id}</span> },
    {
      key: 'patientName',
      label: 'Patient',
      render: (b: BillingRecord) => <span className="font-medium text-gray-800">{b.patientName}</span>,
    },
    { key: 'date', label: 'Date' },
    { key: 'totalAmount', label: 'Amount', render: (b: BillingRecord) => <span className="font-semibold">${b.totalAmount.toLocaleString()}</span> },
    { key: 'insuranceCovered', label: 'Insurance', render: (b: BillingRecord) => <span className="text-green-600">${b.insuranceCovered.toLocaleString()}</span> },
    { key: 'balance', label: 'Balance', render: (b: BillingRecord) => <span className="font-semibold text-orange-600">${(b.totalAmount - b.insuranceCovered).toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (b: BillingRecord) => <StatusBadge status={b.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (b: BillingRecord) => (
        <button onClick={() => setSelectedBill(b)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Billing & Finance</h2>
        <p className="text-gray-500 mt-1">Revenue tracking and billing management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}K`} icon="💰" change="+12% vs last month" changeType="positive" />
        <StatCard title="Paid" value={`$${(paidAmount / 1000).toFixed(1)}K`} icon="✅" change={`${billingRecords.filter(b => b.status === 'Paid').length} bills`} changeType="positive" />
        <StatCard title="Pending" value={`$${(pendingAmount / 1000).toFixed(1)}K`} icon="⏳" change={`${billingRecords.filter(b => b.status === 'Pending').length} bills`} changeType="negative" />
        <StatCard title="Insurance Covered" value={`$${(insuranceCovered / 1000).toFixed(1)}K`} icon="🛡️" change={`${Math.round((insuranceCovered / totalRevenue) * 100)}% of total`} changeType="neutral" />
      </div>

      <DataTable columns={columns} data={billingRecords} searchKeys={['patientName', 'status']} />

      <Modal isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} title="Billing Details" size="lg">
        {selectedBill && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedBill.patientName}</h3>
                <p className="text-sm text-gray-500">Bill #{selectedBill.id} • {selectedBill.date}</p>
              </div>
              <StatusBadge status={selectedBill.status} />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedBill.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-sm">{item.description}</td>
                      <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-right">${item.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium">${(item.amount * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold">${selectedBill.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Insurance Coverage</span>
                <span className="text-green-600 font-medium">-${selectedBill.insuranceCovered.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-800">Balance Due</span>
                <span className="font-bold text-orange-600">${(selectedBill.totalAmount - selectedBill.insuranceCovered).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
