import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import * as api from '../../utils/api';
import { BillingRecord, Patient } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

const METHOD_CONFIG = {
  mpesa: { label: 'M-Pesa', icon: '📱', color: 'bg-green-600', hover: 'hover:bg-green-700', light: 'bg-green-50 border-green-200 text-green-700' },
  bank: { label: 'Bank Transfer', icon: '🏦', color: 'bg-blue-600', hover: 'hover:bg-blue-700', light: 'bg-blue-50 border-blue-200 text-blue-700' },
  insurance: { label: 'Insurance Claim', icon: '🛡️', color: 'bg-violet-600', hover: 'hover:bg-violet-700', light: 'bg-violet-50 border-violet-200 text-violet-700' },
  cash: { label: 'Cash / Other', icon: '💵', color: 'bg-gray-600', hover: 'hover:bg-gray-700', light: 'bg-gray-50 border-gray-200 text-gray-700' },
} as const;

type PayMethod = keyof typeof METHOD_CONFIG;

export default function AdminBilling() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<BillingRecord | null>(null);
  const [payModal, setPayModal] = useState<BillingRecord | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>('mpesa');
  const [payPhone, setPayPhone] = useState('');
  const [payBankRef, setPayBankRef] = useState('');
  const [payBankName, setPayBankName] = useState('');
  const [payInsProvider, setPayInsProvider] = useState('');
  const [payInsNumber, setPayInsNumber] = useState('');
  const [payInsAmount, setPayInsAmount] = useState('');
  const [payCashRef, setPayCashRef] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Create Bill State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBillPatientId, setNewBillPatientId] = useState('');
  const [newBillItems, setNewBillItems] = useState([{ description: '', amount: 0, quantity: 1 }]);
  const [newBillInsurance, setNewBillInsurance] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchBilling();
      setBillingRecords(data);
    } catch (err) {
      console.error('Error fetching billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    api.fetchPatients().then(data => setPatients(data)).catch(console.error);
  }, []);

  const openPay = (bill: BillingRecord) => {
    setPayModal(bill);
    setPayMethod('mpesa');
    setPayPhone('');
    setPayBankRef('');
    setPayBankName('');
    setPayInsProvider('');
    setPayInsNumber('');
    setPayInsAmount(String(bill.totalAmount - bill.insuranceCovered));
    setPayCashRef('');
    setPaySuccess(false);
  };

  const handlePay = async () => {
    if (!payModal) return;
    setIsPaying(true);
    try {
      const balance = payModal.totalAmount - payModal.insuranceCovered;
      let ref = '';

      if (payMethod === 'mpesa') {
        const res = await api.payBill(payModal.id, balance, payPhone);
        ref = res?.reference || 'MOCK-' + Date.now();
      } else {
        if (payMethod === 'bank') ref = payBankRef || 'BANK-' + Date.now();
        else if (payMethod === 'insurance') ref = `INS-${payInsProvider}-${payInsNumber}`;
        else ref = payCashRef || 'CASH-' + Date.now();

        await api.put('billing', payModal.id, {
          ...payModal,
          status: 'Paid',
          payment_status: 'Paid',
          paidAmount: payModal.totalAmount - payModal.insuranceCovered,
          paymentMethod: payMethod,
          paymentRef: ref,
        });
      }

      setPaySuccess(true);
      await loadData();
      if (selectedBill?.id === payModal.id) {
        setSelectedBill(prev => prev ? { ...prev, status: 'Paid', paymentMethod: payMethod, paymentRef: ref } : null);
      }
    } catch (err: any) {
      alert(`Payment processing failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsPaying(false);
    }
  };

  const handleCreateBill = async () => {
    if (!newBillPatientId || newBillItems.length === 0) return;
    setIsCreating(true);
    try {
      const patient = patients.find(p => p.id === newBillPatientId);
      if (!patient) throw new Error("Patient not found");
      const totalAmount = newBillItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
      
      const newBill = {
        id: 'bill-' + Date.now(),
        patientId: patient.id,
        patientName: patient.name,
        date: new Date().toISOString().split('T')[0],
        items: newBillItems,
        totalAmount,
        status: 'Pending',
        payment_status: 'Unpaid',
        paidAmount: 0,
        insuranceCovered: newBillInsurance,
      };

      await api.post('billing', newBill);
      setShowCreateModal(false);
      setNewBillPatientId('');
      setNewBillItems([{ description: '', amount: 0, quantity: 1 }]);
      setNewBillInsurance(0);
      await loadData();
    } catch (err: any) {
      alert(`Failed to create bill: ${err.message || 'Please try again.'}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Billing data...</p></div>;
  }

  const totalRevenue = billingRecords.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = billingRecords.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const pendingAmount = billingRecords.reduce((sum, b) => {
    const bal = b.totalAmount - b.insuranceCovered - (b.paidAmount || 0);
    return sum + (bal > 0 ? bal : 0);
  }, 0);
  const insuranceCovered = billingRecords.reduce((sum, b) => sum + b.insuranceCovered, 0);

  const methodBadge = (m?: string) => {
    if (!m) return null;
    const c = METHOD_CONFIG[m as PayMethod];
    return c ? <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${c.light}`}>{c.icon} {c.label}</span> : null;
  };

  const columns = [
    { key: 'id', label: 'Bill ID', render: (b: BillingRecord) => <span className="font-mono text-xs text-gray-500">{b.id.slice(0, 14)}…</span> },
    { key: 'patientName', label: 'Patient', render: (b: BillingRecord) => <span className="font-medium text-gray-800">{b.patientName}</span> },
    { key: 'date', label: 'Date' },
    { key: 'totalAmount', label: 'Amount', render: (b: BillingRecord) => <span className="font-semibold">Ksh {b.totalAmount.toLocaleString()}</span> },
    { key: 'paidAmount', label: 'Paid', render: (b: BillingRecord) => <span className="text-blue-600 font-medium">Ksh {(b.paidAmount || 0).toLocaleString()}</span> },
    { key: 'balance', label: 'Balance', render: (b: BillingRecord) => <span className="font-semibold text-orange-600">Ksh {(b.totalAmount - b.insuranceCovered - (b.paidAmount || 0)).toLocaleString()}</span> },
    { key: 'payment_status', label: 'Payment', render: (b: BillingRecord) => <StatusBadge status={b.payment_status} /> },
    { key: 'status', label: 'Workflow', render: (b: BillingRecord) => <StatusBadge status={b.status} /> },
    {
      key: 'actions', label: 'Actions',
      render: (b: BillingRecord) => (
        <div className="flex gap-2">
          <button onClick={() => setSelectedBill(b)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View</button>
          {b.status === 'Pending' && (
            <button onClick={() => openPay(b)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
              Pay
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Billing & Finance</h2>
          <p className="text-gray-500 mt-1">Revenue tracking and payment management</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Create Bill
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`Ksh ${(totalRevenue / 1000).toFixed(1)}K`} icon="💰" change="+0% vs last month" changeType="positive" />
        <StatCard title="Total Paid" value={`Ksh ${(totalPaid / 1000).toFixed(1)}K`} icon="✅" change={`${billingRecords.filter(b => b.payment_status === 'Paid').length} bills paid`} changeType="positive" />
        <StatCard title="Pending" value={`Ksh ${(pendingAmount / 1000).toFixed(1)}K`} icon="⏳" change={`${billingRecords.filter(b => b.payment_status !== 'Paid').length} bills pending`} changeType="negative" />
        <StatCard title="Insurance Covered" value={`Ksh ${(insuranceCovered / 1000).toFixed(1)}K`} icon="🛡️" change={totalRevenue > 0 ? `${Math.round((insuranceCovered / totalRevenue) * 100)}% of total` : '0%'} changeType="neutral" />
      </div>

      {/* Payment method breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(METHOD_CONFIG) as PayMethod[]).map(m => {
          const c = METHOD_CONFIG[m];
          const count = billingRecords.filter(b => b.paymentMethod === m).length;
          return (
            <div key={m} className={`border rounded-xl p-4 ${c.light}`}>
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="font-bold text-lg">{count}</p>
              <p className="text-xs font-medium">{c.label}</p>
            </div>
          );
        })}
      </div>

      <DataTable columns={columns} data={billingRecords} searchKeys={['patientName', 'status']} />

      {/* Bill Detail Modal */}
      <Modal isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} title="Billing Details" size="lg">
        {selectedBill && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedBill.patientName}</h3>
                <p className="text-sm text-gray-500">Bill #{selectedBill.id} • {selectedBill.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {methodBadge(selectedBill.paymentMethod)}
                <StatusBadge status={selectedBill.status} />
              </div>
            </div>

            {selectedBill.paymentRef && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
                ✅ Payment Ref: <span className="font-mono font-semibold">{selectedBill.paymentRef}</span>
              </div>
            )}

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
                      <td className="px-4 py-2 text-sm text-right">Ksh {item.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium">Ksh {(item.amount * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Total Amount</span><span className="font-bold">Ksh {selectedBill.totalAmount.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Insurance Coverage</span><span className="text-green-600 font-medium">-Ksh {selectedBill.insuranceCovered.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Amount Paid</span><span className="text-blue-600 font-medium">Ksh {(selectedBill.paidAmount || 0).toLocaleString()}</span></div>
              <hr />
              <div className="flex justify-between text-base"><span className="font-bold text-gray-800">Remaining Balance</span><span className="font-bold text-orange-600">Ksh {(selectedBill.totalAmount - selectedBill.insuranceCovered - (selectedBill.paidAmount || 0)).toLocaleString()}</span></div>
            </div>

            {selectedBill.status === 'Pending' && (
              <div className="pt-2">
                <button onClick={() => { setSelectedBill(null); openPay(selectedBill); }} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  💳 Process Payment
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={!!payModal} onClose={() => { if (!isPaying) { setPayModal(null); setPaySuccess(false); } }} title="Process Payment" size="md">
        {payModal && (
          <div className="space-y-5">
            {paySuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Payment Successful!</h3>
                <p className="text-gray-500 text-sm mb-4">Bill for {payModal.patientName} has been marked as paid.</p>
                <button onClick={() => { setPayModal(null); setPaySuccess(false); }} className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-800">{payModal.patientName}</p>
                  <p className="text-sm text-gray-500">Bill #{payModal.id}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">Ksh {(payModal.totalAmount - payModal.insuranceCovered - (payModal.paidAmount || 0)).toLocaleString()}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>🛡️ Insurance: Ksh {payModal.insuranceCovered.toLocaleString()}</span>
                    <span>💰 Paid: Ksh {(payModal.paidAmount || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Method selector */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(METHOD_CONFIG) as PayMethod[]).map(m => {
                      const c = METHOD_CONFIG[m];
                      return (
                        <button
                          key={m}
                          onClick={() => setPayMethod(m)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${payMethod === m ? `border-indigo-500 ${c.light}` : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                        >
                          <span className="text-xl">{c.icon}</span>
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Method-specific fields */}
                {payMethod === 'mpesa' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-green-800">📱 M-Pesa STK Push</p>
                    <div>
                      <label className={labelCls}>Safaricom Phone Number</label>
                      <input value={payPhone} onChange={e => setPayPhone(e.target.value)} placeholder="2547XXXXXXXX" className={inputCls} />
                    </div>
                    <p className="text-xs text-green-700">An STK push will be sent to this number. Patient will enter their M-Pesa PIN to complete.</p>
                  </div>
                )}

                {payMethod === 'bank' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-blue-800">🏦 Bank Transfer Confirmation</p>
                    <div>
                      <label className={labelCls}>Bank Name</label>
                      <select value={payBankName} onChange={e => setPayBankName(e.target.value)} className={inputCls}>
                        <option value="">Select bank...</option>
                        <option>Equity Bank</option>
                        <option>KCB Bank</option>
                        <option>Co-operative Bank</option>
                        <option>Absa Bank</option>
                        <option>NCBA Bank</option>
                        <option>Standard Chartered</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Transaction / Reference Number</label>
                      <input value={payBankRef} onChange={e => setPayBankRef(e.target.value)} placeholder="e.g. TXN2025XXXXXXX" className={inputCls} />
                    </div>
                    <p className="text-xs text-blue-700">Enter the bank reference number from the patient's transfer receipt.</p>
                  </div>
                )}

                {payMethod === 'insurance' && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-violet-800">🛡️ Insurance Claim</p>
                    <div>
                      <label className={labelCls}>Insurance Provider</label>
                      <select value={payInsProvider} onChange={e => setPayInsProvider(e.target.value)} className={inputCls}>
                        <option value="">Select provider...</option>
                        <option>NHIF / SHA</option>
                        <option>AAR Insurance</option>
                        <option>Jubilee Insurance</option>
                        <option>CIC Insurance</option>
                        <option>Britam Insurance</option>
                        <option>UAP Insurance</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Policy / Claim Number</label>
                      <input value={payInsNumber} onChange={e => setPayInsNumber(e.target.value)} placeholder="e.g. NHIF-XXXXXXXX" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Approved Claim Amount (Ksh)</label>
                      <input type="number" value={payInsAmount} onChange={e => setPayInsAmount(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                )}

                {payMethod === 'cash' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">💵 Cash / Other Payment</p>
                    <div className="mb-3">
                      <label className={labelCls}>Receipt / Reference Number (Optional)</label>
                      <input value={payCashRef} onChange={e => setPayCashRef(e.target.value)} placeholder="e.g. RCPT-12345" className={inputCls} />
                    </div>
                    <p className="text-xs text-gray-500">Confirm cash receipt of <strong>Ksh {(payModal.totalAmount - payModal.insuranceCovered).toLocaleString()}</strong> from patient.</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => setPayModal(null)} disabled={isPaying} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                  <button
                    onClick={handlePay}
                    disabled={isPaying || (payMethod === 'mpesa' && !payPhone) || (payMethod === 'bank' && !payBankRef) || (payMethod === 'insurance' && (!payInsProvider || !payInsNumber))}
                    className={`px-5 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${METHOD_CONFIG[payMethod].color} ${METHOD_CONFIG[payMethod].hover}`}
                  >
                    {isPaying ? 'Processing...' : `${METHOD_CONFIG[payMethod].icon} Confirm ${METHOD_CONFIG[payMethod].label} Payment`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Create Bill Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Bill" size="lg">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Select Patient</label>
            <select value={newBillPatientId} onChange={e => setNewBillPatientId(e.target.value)} className={inputCls}>
              <option value="">Choose a patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Bill Items</label>
            <div className="space-y-2">
              {newBillItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={e => {
                      const newItems = [...newBillItems];
                      newItems[index].description = e.target.value;
                      setNewBillItems(newItems);
                    }}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => {
                      const newItems = [...newBillItems];
                      newItems[index].quantity = Number(e.target.value);
                      setNewBillItems(newItems);
                    }}
                    className={`${inputCls} w-20`}
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Amount (Ksh)"
                    value={item.amount}
                    onChange={e => {
                      const newItems = [...newBillItems];
                      newItems[index].amount = Number(e.target.value);
                      setNewBillItems(newItems);
                    }}
                    className={`${inputCls} w-32`}
                    min="0"
                  />
                  <button
                    onClick={() => {
                      const newItems = newBillItems.filter((_, i) => i !== index);
                      setNewBillItems(newItems);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    disabled={newBillItems.length === 1}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setNewBillItems([...newBillItems, { description: '', amount: 0, quantity: 1 }])}
              className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-800"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label className={labelCls}>Insurance Covered Amount (Ksh)</label>
            <input
              type="number"
              value={newBillInsurance}
              onChange={e => setNewBillInsurance(Number(e.target.value))}
              className={inputCls}
              min="0"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Total Amount:</span>
            <span className="font-bold text-lg">
              Ksh {newBillItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
            <button
              onClick={handleCreateBill}
              disabled={isCreating || !newBillPatientId || newBillItems.some(i => !i.description || i.amount <= 0)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Bill'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
