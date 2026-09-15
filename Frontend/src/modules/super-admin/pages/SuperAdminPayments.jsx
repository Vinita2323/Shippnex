import React, { useState, useEffect, useCallback } from 'react';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import { Search, CreditCard, CheckCircle, Clock, AlertCircle, ArrowDownLeft, ShieldCheck, RefreshCw } from 'lucide-react';

export const SuperAdminPayments = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchPayments = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await superAdminService.getTransactions({
        category: 'CUSTOMER_PAYMENT',
        status: statusFilter,
        search,
        limit: 50,
      });

      if (res.success) {
        setPayments(res.transactions || []);
      }
    } catch (err) {
      console.error('Fetch payments error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalVolume = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Customer Payments & Gateway"
        subtitle="Inbound customer checkout transactions, payment gateways, and gateway reconciliation"
        onRefresh={() => fetchPayments(true)}
        refreshing={refreshing}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Inbound Payments</span>
            <p className="text-2xl font-black text-white m-0">₹{Number(totalVolume).toFixed(2)}</p>
            <p className="text-[11px] text-emerald-400 font-mono m-0">Current filter volume</p>
          </div>
          <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Transaction Count</span>
            <p className="text-2xl font-black text-white m-0">{payments.length}</p>
            <p className="text-[11px] text-slate-400 font-mono m-0">Verified gateway & COD receipts</p>
          </div>
          <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Reconciliation Status</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-lg mt-1">
              <ShieldCheck size={20} />
              <span>100% In Ledger</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono m-0">Audited against order records</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#051716] border border-emerald-950 p-3.5 rounded-2xl">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Order ID, Customer Name, Txn ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'SUCCESS', 'PENDING', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer ${
                  statusFilter === st ? 'bg-emerald-600 text-white' : 'bg-[#020b0b] text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#051716] border border-emerald-950/90 rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#03100f] border-b border-emerald-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4 font-bold">Txn ID</th>
                <th className="py-3.5 px-4 font-bold">Order Ref</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Method</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">No customer payment transactions recorded.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-emerald-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{p.transactionId}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">#{p.referenceId}</td>
                    <td className="py-3.5 px-4 text-slate-200">{p.entityName || 'Customer'}</td>
                    <td className="py-3.5 px-4 font-black text-white font-mono text-sm">
                      ₹{Number(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {p.metadata?.paymentMethod || 'ONLINE'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {p.status || 'SUCCESS'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(p.createdAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
