import { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../context/AuthContext';
import { billingRecords } from '../../data/mockData';
import { BillingRecord } from '../../types';

export default function PatientBilling() {
  const { user } = useAuth();
  const myBills = billingRecords.filter(b => b.patientId === user?.id);
  const [selectedBill, setSelectedBill] = useState<BillingRecord | null>(null);

  const totalBilled = myBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalInsurance = myBills.reduce((sum, b) => sum + b.insuranceCovered, 0);
  const totalDue = myBills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + (b.totalAmount - b.insuranceCovered), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Bills</h2>
        <p className="text-gray-500 mt-1">View your billing and payment history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Billed" value={`$${totalBilled.toLocaleString()}`} icon="💰" />
        <StatCard title="Insurance Covered" value={`$${totalInsurance.toLocaleString()}`} icon="🛡️" change={`${Math.round((totalInsurance / totalBilled) * 100)}% covered`} changeType="positive" />
        <StatCard title="Amount Due" value={`$${totalDue.toLocaleString()}`} icon="⏳" change={totalDue > 0 ? 'Payment pending' : 'All paid!'} changeType={totalDue > 0 ? 'negative' : 'positive'} />
      </div>

      {myBills.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-gray-500">No billing records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBills.map(bill => (
            <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedBill(bill)}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-400">Bill #{bill.id}</p>
                  <p className="text-sm text-gray-500">{bill.date}</p>
                </div>
                <StatusBadge status={bill.status} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {bill.items.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-sm text-gray-600">{item.description}</p>
                  ))}
                  {bill.items.length > 2 && <p className="text-xs text-gray-400">+{bill.items.length - 2} more items</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">${bill.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-green-600">Insurance: -${bill.insuranceCovered.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-orange-600">Due: ${(bill.totalAmount - bill.insuranceCovered).toLocaleString()}</p>
                </div>
              </div>
              {bill.status === 'Pending' && (
                <button className="mt-3 w-full py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors" onClick={(e) => e.stopPropagation()}>
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} title="Bill Details" size="lg">
        {selectedBill && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-gray-500">Bill #{selectedBill.id}</p>
                <p className="text-sm text-gray-500">{selectedBill.date}</p>
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
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">${item.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">${(item.amount * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">${selectedBill.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Insurance Coverage</span>
                <span className="text-green-600 font-medium">-${selectedBill.insuranceCovered.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-800">Total Due</span>
                <span className="font-bold text-orange-600">${(selectedBill.totalAmount - selectedBill.insuranceCovered).toLocaleString()}</span>
              </div>
            </div>

            {selectedBill.status === 'Pending' && (
              <button className="w-full py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors">
                Pay ${(selectedBill.totalAmount - selectedBill.insuranceCovered).toLocaleString()}
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
