import React, { useState } from 'react';
import DriverBottomNav from '../components/DriverBottomNav';

const DriverWallet = () => {
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [cashoutStatus, setCashoutStatus] = useState('idle'); // 'idle' | 'transferring' | 'done'

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

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-28">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-xl font-bold text-primary">Earnings & Wallet</h1>
            <p className="text-xs text-on-surface-variant">Real-time driver payout dashboard</p>
          </div>
          <button
            onClick={() => alert('Downloading official tax invoice PDF...')}
            className="p-2 text-primary hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Statement
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4 max-w-7xl mx-auto space-y-6">
        {/* Main Wallet Balance Card - High Contrast Visibility */}
        <div className="p-6 rounded-3xl relative overflow-hidden bg-[#002625] shadow-xl border border-emerald-900/40 text-white">
          <div className="absolute top-4 right-4 opacity-15">
            <span className="material-symbols-outlined text-[120px] text-[#97fc43]">account_balance_wallet</span>
          </div>

          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-xs font-label-sm text-[#97fc43] uppercase tracking-widest font-black">Available Balance</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-1 tracking-tight">₹14,825.00</h2>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                <span className="material-symbols-outlined text-base text-[#97fc43]">check_circle</span>
                Next auto-payout: Tuesday, Jul 28
              </div>

              <button
                onClick={() => setShowCashoutModal(true)}
                className="bg-[#97fc43] hover:bg-[#86e835] text-[#002625] font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">bolt</span>
                Instant Cashout
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Breakdown Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">Base Fares</p>
            <p className="text-xl font-bold text-primary mt-1">₹9,400.00</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">Surge Bonuses</p>
            <p className="text-xl font-bold text-secondary mt-1">₹2,800.00</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">Tips</p>
            <p className="text-xl font-bold text-primary mt-1">₹1,625.00</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">Incentives</p>
            <p className="text-xl font-bold text-secondary mt-1">₹1,000.00</p>
          </div>
        </section>

        {/* Weekly Quest / Incentive Progress */}
        <div className="glass-panel p-5 rounded-2xl border-white/60 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-base">military_tech</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-primary">Weekly Peak Quest</h3>
                <p className="text-xs text-on-surface-variant">Complete 20 deliveries by Sunday</p>
              </div>
            </div>
            <span className="font-bold text-sm text-secondary">+₹1,500.00 Bonus</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
              <span>Progress: 16 of 20 trips</span>
              <span>80%</span>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[80%] transition-all duration-500"></div>
            </div>
          </div>
        </div>

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
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-primary">Recent Transactions</h3>
            <button
              onClick={() => alert('Filter transactions by date range')}
              className="text-xs font-bold text-on-surface-variant hover:text-primary cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Filter
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((trx) => (
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
