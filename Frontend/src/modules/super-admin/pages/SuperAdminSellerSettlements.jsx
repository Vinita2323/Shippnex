import React, { useState, useEffect, useCallback } from 'react';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import { Search, Store, Percent, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export const SuperAdminSellerSettlements = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settlements, setSettlements] = useState([]);
  const [summary, setSummary] = useState({
    totalSettledAmount: 0,
    pendingSettlementAmount: 0,
    totalCommissionEarned: 0,
    totalTransactions: 0,
  });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const fetchSettlements = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await superAdminService.getSellerSettlements({
          page,
          status,
          search,
          limit: 25,
        });

        if (res.success) {
          setSettlements(res.settlements || []);
          if (res.summary) setSummary(res.summary);
          setPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Fetch seller settlements error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, status, search]
  );

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Seller Settlements & Commissions"
        subtitle="Audited breakdown of gross sales, platform commissions deducted, and net seller payables"
        onRefresh={() => fetchSettlements(true)}
        refreshing={refreshing}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Settled to Sellers</span>
            <p className="text-2xl font-black text-emerald-400 m-0">₹{Number(summary.totalSettledAmount).toFixed(2)}</p>
            <p className="text-[11px] text-slate-400 font-mono m-0">Delivered & credited orders</p>
          </div>
          <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Pending Delivery Settlement</span>
            <p className="text-2xl font-black text-amber-400 m-0">₹{Number(summary.pendingSettlementAmount).toFixed(2)}</p>
            <p className="text-[11px] text-slate-400 font-mono m-0">Orders currently in transit</p>
          </div>
          <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Commission Realized</span>
            <p className="text-2xl font-black text-white m-0">₹{Number(summary.totalCommissionEarned).toFixed(2)}</p>
            <p className="text-[11px] text-emerald-400 font-mono m-0">Platform earnings share</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#051716] border border-emerald-950 p-3.5 rounded-2xl">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Order ID, Seller Name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'SETTLED', 'PENDING'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatus(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer ${
                  status === st ? 'bg-emerald-600 text-white' : 'bg-[#020b0b] text-slate-400 hover:text-white'
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
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Seller Store</th>
                <th className="py-3.5 px-4 font-bold">Gross Order</th>
                <th className="py-3.5 px-4 font-bold">Commission</th>
                <th className="py-3.5 px-4 font-bold">Net Seller Payable</th>
                <th className="py-3.5 px-4 font-bold">Settlement Status</th>
                <th className="py-3.5 px-4 font-bold">Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">Loading settlements...</td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">No seller settlement records found.</td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s._id} className="hover:bg-emerald-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">#{s.orderId}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{s.sellerName || 'Seller Store'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                      ₹{Number(s.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-400">
                      ₹{Number(s.commissionAmount || 0).toFixed(2)} ({s.commissionRate || 10}%)
                    </td>
                    <td className="py-3.5 px-4 font-black text-white font-mono text-sm">
                      ₹{Number(s.netSellerAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                          s.settlementStatus === 'SETTLED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {s.settlementStatus || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 bg-[#03100f] border-t border-emerald-950 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Page <span className="text-white font-bold">{page}</span> of{' '}
              <span className="text-white font-bold">{pages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-slate-300 border border-emerald-950 hover:bg-emerald-900/60 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-slate-300 border border-emerald-950 hover:bg-emerald-900/60 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
