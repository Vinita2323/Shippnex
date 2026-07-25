import React, { useState } from 'react';
import DriverBottomNav from '../components/DriverBottomNav';

const DriverWallet = () => {
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [cashoutStatus, setCashoutStatus] = useState('idle'); // 'idle' | 'transferring' | 'done'
  const [filterType, setFilterType] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleCashout = () => {
    setCashoutStatus('transferring');
    setTimeout(() => {
      setCashoutStatus('done');
      setTimeout(() => {
        setShowCashoutModal(false);
        setCashoutStatus('idle');
      }, 1200);
    }, 1500);
  };

  const transactions = [
    { id: 'TRX-9481', date: 'Today, 10:42 AM', amount: '+₹840.00', type: 'Delivery Fare (#JOB-5412)', status: 'Completed' },
    { id: 'TRX-9420', date: 'Today, 09:15 AM', amount: '+₹1,105.50', type: 'Express Cargo Fare (#JOB-5390)', status: 'Completed' },
    { id: 'TRX-9302', date: 'Yesterday', amount: '+₹2,400.00', type: 'Weekly Performance Bonus', status: 'Completed' },
    { id: 'TRX-8910', date: 'Jul 21, 2026', amount: '-₹12,500.00', type: 'Direct Deposit Transfer (HDFC ****4821)', status: 'Transferred' },
  ];

  const filteredTransactions = transactions.filter(trx => {
    if (filterType === 'All') return true;
    if (filterType === 'Earnings') return trx.amount.startsWith('+');
    if (filterType === 'Withdrawals') return trx.amount.startsWith('-');
    return true;
  });

  const handleExport = () => {
    const headers = ['Transaction ID', 'Date & Time', 'Amount', 'Description', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredTransactions.forEach(trx => {
      const row = [
        `"${trx.id}"`,
        `"${trx.date}"`,
        `"${trx.amount}"`,
        `"${trx.type}"`,
        `"${trx.status}"`
      ];
      csvRows.push(row.join(','));
    });
    
    // Adding BOM (\uFEFF) ensures Excel reads the UTF-8 character (₹) correctly
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shippnex_wallet_transactions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-28">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-3xl px-4 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-black text-white tracking-tight">Earnings & Wallet</h1>
            <p className="text-[10px] md:text-xs text-[#97fc43] font-medium tracking-wide uppercase mt-0.5">Real-time payout dashboard</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 px-4 max-w-7xl mx-auto space-y-6">
        {/* Main Wallet Balance Card - High Contrast Visibility */}
        <div className="p-5 rounded-3xl relative overflow-hidden bg-[#002625] shadow-xl border border-emerald-900/40 text-white max-w-sm mx-auto w-full">
          <div className="absolute top-2 right-2 opacity-15">
            <span className="material-symbols-outlined text-[80px] text-[#97fc43]">account_balance_wallet</span>
          </div>

          <div className="relative z-10 space-y-3">
            <div>
              <p className="text-[10px] font-label-sm text-[#97fc43] uppercase tracking-widest font-black">Available Balance</p>
              <h2 className="text-3xl font-extrabold text-white mt-0.5 tracking-tight">₹14,825.00</h2>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-200 font-medium">
                <span className="material-symbols-outlined text-[14px] text-[#97fc43]">check_circle</span>
                Next auto-payout: Tuesday, Jul 28
              </div>

              <button
                onClick={() => setShowCashoutModal(true)}
                className="w-full bg-[#97fc43] hover:bg-[#86e835] text-[#002625] font-black py-2.5 rounded-xl text-xs shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">bolt</span>
                Instant Cashout
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Breakdown Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">From Transport</p>
            <p className="text-xl font-bold text-primary mt-1">₹9,400.00</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">From Deliveries</p>
            <p className="text-xl font-bold text-secondary mt-1">₹5,425.00</p>
          </div>
        </section>



        {/* Bank Account & Payment Methods Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-primary">Payout Account</h3>
            <button
              onClick={() => alert('Managing payout methods...')}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              Edit Method
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <p className="font-bold text-xs text-primary">HDFC Bank</p>
                <p className="text-[11px] text-on-surface-variant">Checking account •••• 4821</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full">
              PRIMARY
            </span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center relative">
            <h3 className="font-bold text-sm text-primary">Recent Transactions {filterType !== 'All' && <span className="text-[#15803d]">({filterType})</span>}</h3>
            
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`text-xs font-bold cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${showFilterDropdown ? 'bg-[#366b00] text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                Filter
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden z-20">
                  {['All', 'Earnings', 'Withdrawals'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${filterType === type ? 'text-[#15803d] bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map((trx) => (
              <div key={trx.id} className="flex justify-between items-center p-3 bg-surface-container-low/70 rounded-xl">
                <div>
                  <p className="font-bold text-xs text-primary">{trx.type}</p>
                  <p className="text-[11px] text-on-surface-variant">{trx.date} • {trx.id}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-xs ${trx.amount.startsWith('+') ? 'text-secondary' : 'text-primary'}`}>
                    {trx.amount}
                  </p>
                  <span className="text-[10px] font-semibold text-outline-variant">{trx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cashout Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border-white shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">bolt</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-xl text-primary">Instant Cashout</h3>
              <p className="text-xs text-on-surface-variant">Transfer ₹14,825.00 immediately to HDFC ****4821</p>
            </div>

            <div className="bg-surface-container p-3.5 rounded-xl space-y-2 text-xs border border-outline-variant/30">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Transfer Amount</span>
                <span className="font-bold text-primary">₹14,825.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Instant Fee (1.5%)</span>
                <span className="font-bold text-primary">₹0.00 (Waived)</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-2 font-bold text-sm">
                <span>Net Transfer</span>
                <span className="text-secondary">₹14,825.00</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCashoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCashout}
                className="flex-1 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {cashoutStatus === 'transferring' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    Transferring...
                  </>
                ) : cashoutStatus === 'done' ? (
                  <>
                    Transferred! <span className="material-symbols-outlined text-sm">check</span>
                  </>
                ) : (
                  'Confirm Transfer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default DriverWallet;
