import { useState, useEffect } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../utils/api';
import { BillingRecord } from '../../types';

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

const METHOD_CONFIG = {
  mpesa: { label: 'M-Pesa', icon: '📱', color: 'bg-green-600', hover: 'hover:bg-green-700', light: 'bg-green-50 border-green-300 text-green-800' },
  bank: { label: 'Bank Transfer', icon: '🏦', color: 'bg-blue-600', hover: 'hover:bg-blue-700', light: 'bg-blue-50 border-blue-300 text-blue-800' },
  insurance: { label: 'Insurance Claim', icon: '🛡️', color: 'bg-violet-600', hover: 'hover:bg-violet-700', light: 'bg-violet-50 border-violet-300 text-violet-800' },
  cash: { label: 'Cash / Other', icon: '💵', color: 'bg-gray-600', hover: 'hover:bg-gray-700', light: 'bg-gray-50 border-gray-300 text-gray-800' },
} as const;

type PayMethod = keyof typeof METHOD_CONFIG;

export default function PatientBilling() {
  const { user } = useAuth();
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<BillingRecord | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>('mpesa');
  const [payPhone, setPayPhone] = useState('');
  const [payBankRef, setPayBankRef] = useState('');
  const [payBankName, setPayBankName] = useState('');
  const [payInsProvider, setPayInsProvider] = useState('');
  const [payInsNumber, setPayInsNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [showPayPanel, setShowPayPanel] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchBilling();
      setBillingRecords(data);
    } catch (err) {
      console.error('Error fetching billing records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openBill = (bill: BillingRecord) => {
    setSelectedBill(bill);
    setShowPayPanel(false);
    setPaySuccess(false);
    setPayMethod('mpesa');
    setPayPhone('');
    setPayBankRef('');
    setPayBankName('');
    setPayInsProvider('');
    setPayInsNumber('');
  };

  const handlePay = async () => {
    if (!selectedBill) return;
    setIsPaying(true);
    try {
      const balance = selectedBill.totalAmount - selectedBill.insuranceCovered;
      let ref = '';

      if (payMethod === 'mpesa') {
        const res = await api.initiateMPesa(payPhone, balance, selectedBill.id, `Bill ${selectedBill.id}`);
        ref = res?.CheckoutRequestID || 'MPESA-' + Date.now();
      } else if (payMethod === 'bank') {
        ref = payBankRef || 'BANK-' + Date.now();
      } else if (payMethod === 'insurance') {
        ref = `INS-${payInsProvider}-${payInsNumber}`;
      } else {
        ref = 'CASH-' + Date.now();
      }

      await api.put('billing', selectedBill.id, {
        ...selectedBill,
        status: 'Paid',
        paymentMethod: payMethod,
        paymentRef: ref,
      });

      setPaySuccess(true);
      await loadData();
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Loading Bills...</p></div>;
  }

  const myBills = billingRecords.filter(b => b.patientId === user?.id);
  const totalBilled = myBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalInsurance = myBills.reduce((sum, b) => sum + b.insuranceCovered, 0);
  const totalDue = myBills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + (b.totalAmount - b.insuranceCovered), 0);

  const methodBadge = (m?: string) => {
    if (!m) return null;
    const c = METHOD_CONFIG[m as PayMethod];
    return c ? <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${c.light}`}>{c.icon} {c.label}</span> : null;
  };

  const isPayDisabled = isPaying
    || (payMethod === 'mpesa' && !payPhone)
    || (payMethod === 'bank' && !payBankRef)
    || (payMethod === 'insurance' && (!payInsProvider || !payInsNumber));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Bills</h2>
        <p className="text-gray-500 mt-1">View your billing and payment history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Billed" value={`Ksh ${totalBilled.toLocaleString()}`} icon="💰" />
        <StatCard title="Insurance Covered" value={`Ksh ${totalInsurance.toLocaleString()}`} icon="🛡️" change={totalBilled > 0 ? `${Math.round((totalInsurance / totalBilled) * 100)}% covered` : '0% covered'} changeType="positive" />
        <StatCard title="Amount Due" value={`Ksh ${totalDue.toLocaleString()}`} icon="⏳" change={totalDue > 0 ? 'Payment pending' : 'All paid! 🎉'} changeType={totalDue > 0 ? 'negative' : 'positive'} />
      </div>

      {myBills.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-gray-500">No billing records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBills.map(bill => {
            const balance = bill.totalAmount - bill.insuranceCovered;
            return (
              <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5 cursor-pointer" onClick={() => openBill(bill)}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-gray-400">Bill #{bill.id}</p>
                      <p className="text-sm text-gray-500">{bill.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {methodBadge(bill.paymentMethod)}
                      <StatusBadge status={bill.status} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {bill.items.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-sm text-gray-600">{item.description}</p>
                      ))}
                      {bill.items.length > 2 && <p className="text-xs text-gray-400">+{bill.items.length - 2} more items</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">Ksh {bill.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">Insurance: -Ksh {bill.insuranceCovered.toLocaleString()}</p>
                      <p className={`text-sm font-semibold ${bill.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {bill.status === 'Paid' ? '✅ Paid' : `Due: Ksh ${balance.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>
                {bill.status === 'Pending' && (
                  <div className="px-5 pb-5">
                    <button
                      onClick={(e) => { e.stopPropagation(); openBill(bill); setShowPayPanel(true); }}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-200"
                    >
                      💳 Pay Now — Ksh {balance.toLocaleString()}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bill Detail + Payment Modal */}
      <Modal isOpen={!!selectedBill} onClose={() => { setSelectedBill(null); setPaySuccess(false); setShowPayPanel(false); }} title={showPayPanel ? 'Make Payment' : 'Bill Details'} size="lg">
        {selectedBill && (
          <div className="space-y-5">

            {/* Success screen */}
            {paySuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Payment Successful!</h3>
                <p className="text-gray-500 text-sm mb-1">Your payment has been received.</p>
                <p className="text-xs text-gray-400 mb-6">Method: {METHOD_CONFIG[payMethod].label}</p>
                <button onClick={() => { setSelectedBill(null); setPaySuccess(false); setShowPayPanel(false); }} className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  Done
                </button>
              </div>
            ) : showPayPanel ? (
              /* Payment Panel */
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Paying for Bill #{selectedBill.id}</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">Ksh {(selectedBill.totalAmount - selectedBill.insuranceCovered).toLocaleString()}</p>
                  {selectedBill.insuranceCovered > 0 && <p className="text-xs text-green-600 mt-1">✅ Insurance covers Ksh {selectedBill.insuranceCovered.toLocaleString()}</p>}
                </div>

                {/* Method selector */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">How would you like to pay?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(METHOD_CONFIG) as PayMethod[]).map(m => {
                      const c = METHOD_CONFIG[m];
                      return (
                        <button
                          key={m}
                          onClick={() => setPayMethod(m)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all ${payMethod === m ? `border-violet-500 ${c.light}` : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                        >
                          <span className="text-2xl">{c.icon}</span>
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* M-Pesa */}
                {payMethod === 'mpesa' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-green-800">📱 M-Pesa STK Push</p>
                    <div>
                      <label className={labelCls}>Your Safaricom Number</label>
                      <input value={payPhone} onChange={e => setPayPhone(e.target.value)} placeholder="2547XXXXXXXX" className={inputCls} />
                    </div>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>1. Enter your phone number above</li>
                      <li>2. Click Pay — you'll receive an STK push</li>
                      <li>3. Enter your M-Pesa PIN on your phone</li>
                      <li>4. Payment confirmed instantly</li>
                    </ul>
                  </div>
                )}

                {/* Bank Transfer */}
                {payMethod === 'bank' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-blue-800">🏦 Bank Transfer</p>
                    <div className="bg-white rounded-lg p-3 text-xs space-y-1 border border-blue-100">
                      <p className="font-semibold text-gray-700">Hospital Bank Details:</p>
                      <p>Bank: <span className="font-medium">Equity Bank</span></p>
                      <p>Account: <span className="font-medium">0123456789012</span></p>
                      <p>Branch: <span className="font-medium">Nairobi CBD</span></p>
                      <p>Ref: <span className="font-medium text-orange-600">{selectedBill.id}</span></p>
                    </div>
                    <div>
                      <label className={labelCls}>Your Bank</label>
                      <select value={payBankName} onChange={e => setPayBankName(e.target.value)} className={inputCls}>
                        <option value="">Select your bank...</option>
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
                      <label className={labelCls}>Transaction Reference</label>
                      <input value={payBankRef} onChange={e => setPayBankRef(e.target.value)} placeholder="Transaction confirmation number" className={inputCls} />
                    </div>
                  </div>
                )}

                {/* Insurance */}
                {payMethod === 'insurance' && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-violet-800">🛡️ Insurance Claim</p>
                    <div>
                      <label className={labelCls}>Insurance Provider</label>
                      <select value={payInsProvider} onChange={e => setPayInsProvider(e.target.value)} className={inputCls}>
                        <option value="">Select your insurer...</option>
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
                      <label className={labelCls}>Member / Policy Number</label>
                      <input value={payInsNumber} onChange={e => setPayInsNumber(e.target.value)} placeholder="e.g. NHIF-XXXXXXXX" className={inputCls} />
                    </div>
                    <p className="text-xs text-violet-700">The hospital will verify your claim with the insurer. Any remaining balance must be settled separately.</p>
                  </div>
                )}

                {/* Cash */}
                {payMethod === 'cash' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700">💵 Cash Payment</p>
                    <p className="text-xs text-gray-500 mt-2">Please visit the billing counter and present this bill reference:</p>
                    <p className="font-mono font-bold text-lg text-gray-800 mt-1">{selectedBill.id}</p>
                    <p className="text-xs text-gray-500 mt-2">Click confirm to log this as a cash payment.</p>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <button onClick={() => setShowPayPanel(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">← Back</button>
                  <button
                    onClick={handlePay}
                    disabled={isPayDisabled}
                    className={`px-5 py-2.5 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${METHOD_CONFIG[payMethod].color} ${METHOD_CONFIG[payMethod].hover}`}
                  >
                    {isPaying ? 'Processing...' : `${METHOD_CONFIG[payMethod].icon} Pay Ksh ${(selectedBill.totalAmount - selectedBill.insuranceCovered).toLocaleString()}`}
                  </button>
                </div>
              </>
            ) : (
              /* Bill Details View */
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-gray-500">Bill #{selectedBill.id}</p>
                    <p className="text-sm text-gray-500">{selectedBill.date}</p>
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
                          <td className="px-4 py-3 text-sm">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right">Ksh {item.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">Ksh {(item.amount * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-bold">Ksh {selectedBill.totalAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Insurance Coverage</span><span className="text-green-600 font-medium">-Ksh {selectedBill.insuranceCovered.toLocaleString()}</span></div>
                  <hr />
                  <div className="flex justify-between text-lg"><span className="font-bold text-gray-800">Total Due</span><span className="font-bold text-orange-600">Ksh {(selectedBill.totalAmount - selectedBill.insuranceCovered).toLocaleString()}</span></div>
                </div>

                {selectedBill.status === 'Pending' && (
                  <button
                    onClick={() => setShowPayPanel(true)}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-200 text-sm"
                  >
                    💳 Choose Payment Method & Pay
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
