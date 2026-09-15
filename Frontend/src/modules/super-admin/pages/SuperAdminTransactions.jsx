import React, { useState, useEffect, useCallback } from 'react';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import {
  Search,
  Filter,
  Download,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const SuperAdminTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(25);

  // Filters
  const [category, setCategory] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected Txn for Detail Drawer Modal
  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchTransactions = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await superAdminService.getTransactions({
          page,
          limit,
          category,
          type,
          status,
          search,
          startDate,
          endDate,
        });

        if (res.success) {
          setTransactions(res.transactions || []);
          setTotal(res.total || 0);
          setPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Fetch ledger transactions error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, category, type, status, search, startDate, endDate]
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Category', 'Type', 'Amount', 'Party', 'Reference', 'Status', 'Date'];
    const rows = transactions.map((t) => [
      `"${t.transactionId}"`,
      `"${t.category}"`,
      `"${t.type}"`,
      t.amount,
      `"${t.entityName || t.entityType}"`,
      `"${t.referenceId || ''}"`,
      `"${t.status}"`,
      `"${new Date(t.createdAt).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shippnex_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categories = [
    'ALL',
    'CUSTOMER_PAYMENT',
    'SELLER_EARNING',
    'CAPTAIN_EARNING',
    'SELLER_PAYOUT',
    'CAPTAIN_PAYOUT',
    'PLATFORM_COMMISSION',
    'REFUND',
    'FINANCIAL_ADJUSTMENT',
    'MEMBERSHIP_FEE',
    'REGISTRATION_FEE',
  ];

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Central Transaction Ledger"
        subtitle="Audited record of every money movement across users, sellers, captains, and platform treasury"
        onRefresh={() => fetchTransactions(true)}
        refreshing={refreshing}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Filters Bar */}
        <div className="bg-[#051716] border border-emerald-950/90 p-4 rounded-2xl shadow-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Txn ID, Order, Party..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Types (Credit/Debit)</option>
              <option value="CREDIT">Credit (+)</option>
              <option value="DEBIT">Debit (-)</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-400 font-medium">
              Showing <span className="text-white font-bold">{transactions.length}</span> of{' '}
              <span className="text-white font-bold">{total}</span> ledger entries
            </span>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2f2b] hover:bg-[#0f403b] text-emerald-300 font-semibold rounded-xl border border-emerald-500/30 cursor-pointer transition-all"
            >
              <FileSpreadsheet size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#051716] border border-emerald-950/90 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#03100f] border-b border-emerald-950/90 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Transaction ID</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Party / Entity</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Type</th>
                  <th className="py-3.5 px-4 font-bold">Reference</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Loading central ledger entries...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No ledger transactions found matching the applied filters.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn._id} className="hover:bg-emerald-950/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{txn.transactionId}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/50 border border-emerald-900/40 text-[11px]">
                          {txn.category?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 font-medium">
                        <div>{txn.entityName || txn.entityType}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{txn.entityType}</span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-white font-mono text-sm">
                        ₹{Number(txn.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold font-mono text-[10.5px] ${
                            txn.type === 'CREDIT'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {txn.type === 'CREDIT' ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        {txn.referenceId || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {txn.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(txn.createdAt).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedTxn(txn)}
                          className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 rounded-lg border border-emerald-500/30 cursor-pointer transition-colors"
                          title="View complete transaction breakdown"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-[#03100f] border-t border-emerald-950/80 flex items-center justify-between text-xs">
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

      {/* Transaction Detail Drawer Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-black space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-emerald-950/80 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase font-bold">
                  CENTRAL AUDIT ENTRY
                </span>
                <h3 className="text-lg font-bold text-white m-0">{selectedTxn.transactionId}</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Category</span>
                <span className="font-bold text-white font-mono">{selectedTxn.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Type</span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded ${
                    selectedTxn.type === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {selectedTxn.type}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Amount</span>
                <span className="font-black text-white text-sm font-mono">₹{Number(selectedTxn.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Entity / Party</span>
                <span className="font-bold text-slate-200">{selectedTxn.entityName || selectedTxn.entityType} ({selectedTxn.entityType})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Reference</span>
                <span className="font-mono text-emerald-400">{selectedTxn.referenceModel} #{selectedTxn.referenceId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Balance State</span>
                <span className="font-mono text-slate-300">
                  ₹{Number(selectedTxn.balanceBefore || 0).toFixed(2)} ➔ ₹{Number(selectedTxn.balanceAfter || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-950/50">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-emerald-400">{selectedTxn.status}</span>
              </div>
              <div className="py-1.5">
                <span className="text-slate-400 block mb-1">Description / Remarks</span>
                <p className="text-slate-200 bg-[#020b0b] p-2.5 rounded-xl border border-emerald-950 font-medium m-0">
                  {selectedTxn.description || 'No additional description provided.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-none cursor-pointer mt-2"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
