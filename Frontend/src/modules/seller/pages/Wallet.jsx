import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const mockTransactions = [
  { id: '1', orderId: '#ORD1783334491042306', type: 'Sale proceeds from Order', date: '6 Jul 2026, 04:12 pm', amount: '+₹90.00', status: 'Success', isCredit: true },
  { id: '2', orderId: '#ORD1783334383313326', type: 'Sale proceeds from Order', date: '6 Jul 2026, 04:10 pm', amount: '+₹90.00', status: 'Success', isCredit: true },
  { id: '3', orderId: '#ORD1783333066152441', type: 'Sale proceeds from Order', date: '6 Jul 2026, 03:48 pm', amount: '+₹90.00', status: 'Success', isCredit: true },
  { id: '4', orderId: '#ORD1783332226343079', type: 'Sale proceeds from Order', date: '6 Jul 2026, 03:24 pm', amount: '+₹90.00', status: 'Success', isCredit: true },
  { id: '5', orderId: '#ORD1783331554201985', type: 'Sale proceeds from Order', date: '6 Jul 2026, 02:15 pm', amount: '+₹48,200.00', status: 'Success', isCredit: true },
];

const mockWithdrawals = [
  { id: 'W1', amount: '₹100.00', method: 'Bank Transfer', date: '30 Apr 2026', status: 'Completed' },
  { id: 'W2', amount: '₹15,000.00', method: 'Bank Transfer', date: '5 Jul 2026', status: 'Completed' },
  { id: 'W3', amount: '₹50,000.00', method: 'Bank Transfer', date: '28 Jun 2026', status: 'Completed' },
];

const mockCommissions = [
  { id: 'C1', title: 'Order Commission', rate: 'Rate: 10%', orderAmount: 'Order Amount: ₹100.00', commissionAmount: '₹10.00', date: '6/7/2026' },
  { id: 'C2', title: 'Order Commission', rate: 'Rate: 10%', orderAmount: 'Order Amount: ₹100.00', commissionAmount: '₹10.00', date: '6/7/2026' },
  { id: 'C3', title: 'Order Commission', rate: 'Rate: 10%', orderAmount: 'Order Amount: ₹100.00', commissionAmount: '₹10.00', date: '6/7/2026' },
  { id: 'C4', title: 'Order Commission', rate: 'Rate: 10%', orderAmount: 'Order Amount: ₹48,200.00', commissionAmount: '₹4,820.00', date: '5/7/2026' },
];

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('Transactions');

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Top Header & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Wallet</h1>
        <p className="text-xs font-normal text-slate-400 mt-1">Home / Wallet</p>
      </div>

      {/* Bank Details Missing Alert Banner */}
      <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ff7526]/10 border border-[#ff7526]/20 text-[#ff7526] flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Bank Details Missing</h4>
            <p className="text-xs text-slate-500 font-normal">Please update bank details to enable withdrawals.</p>
          </div>
        </div>
        <button 
          onClick={() => alert('Opening Bank Details Update Form...')}
          className="px-4 py-1.5 bg-white hover:bg-orange-50 border border-orange-200 text-[#ff7526] font-medium text-xs rounded-lg cursor-pointer transition-colors shadow-2xs"
        >
          Update Now
        </button>
      </div>

      {/* Wallet Balance Theme Card */}
      <div className="bg-[#ff7526] rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-4 relative overflow-hidden">
        <div>
          <p className="text-sm font-normal text-white/90">Wallet Balance</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mt-1">₹408291.60</h2>
        </div>
        <div>
          <button 
            onClick={() => alert('Withdrawal request initiated!')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#ff7526] font-medium text-sm rounded-lg border-none cursor-pointer transition-colors shadow-xs"
          >
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Tabs & Data Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Navigation Tabs with Theme Orange Active Line */}
        <div className="flex border-b border-slate-200 bg-white">
          {['Transactions', 'Withdrawals', 'Commissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 px-8 font-medium text-sm cursor-pointer transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-[#ff7526] text-[#ff7526] font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 space-y-3">
          
          {/* TRANSACTIONS TAB */}
          {activeTab === 'Transactions' && (
            <div className="space-y-3">
              {mockTransactions.map((txn) => (
                <div 
                  key={txn.id} 
                  className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-normal text-slate-900 text-sm sm:text-base">
                        {txn.type} <strong className="font-semibold text-slate-900">{txn.orderId}</strong>
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                        {txn.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-normal">{txn.date}</p>
                  </div>

                  <div className={`font-semibold text-base sm:text-lg text-right shrink-0 ${txn.isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {txn.amount}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WITHDRAWALS TAB */}
          {activeTab === 'Withdrawals' && (
            <div className="space-y-3">
              {mockWithdrawals.map((w) => (
                <div 
                  key={w.id} 
                  className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900 text-base">{w.amount}</h4>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">{w.method}</p>
                    <p className="text-xs text-slate-400 font-normal mt-1">{w.date}</p>
                  </div>
                  <div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMMISSIONS TAB */}
          {activeTab === 'Commissions' && (
            <div className="space-y-3">
              {mockCommissions.map((c) => (
                <div 
                  key={c.id} 
                  className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-slate-900 text-base">{c.title}</h4>
                    <p className="text-xs text-slate-500 font-normal">{c.rate}</p>
                    <p className="text-xs text-slate-500 font-normal">{c.orderAmount}</p>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span className="font-bold text-emerald-600 text-base">{c.commissionAmount}</span>
                    <p className="text-xs text-slate-400 font-normal">{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Wallet;
