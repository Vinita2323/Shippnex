import React, { useState, useEffect, useCallback } from 'react';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import { RotateCcw, Search, Check, X, AlertCircle, Loader2 } from 'lucide-react';

export const SuperAdminRefunds = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [search, setSearch] = useState('');

  // Process Modal State
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [modalStatus, setModalStatus] = useState('COMPLETED');
  const [gatewayRefundId, setGatewayRefundId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRefunds = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await superAdminService.getRefunds();
      if (res.success) {
        setRefunds(res.refunds || []);
      }
    } catch (err) {
      console.error('Fetch refunds error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handleProcessSubmit = async () => {
    if (!selectedRefund) return;
    setActionLoading(true);
    setError('');

    try {
      const res = await superAdminService.processRefund(selectedRefund._id, {
        status: modalStatus,
        gatewayRefundId,
        remarks,
      });

      if (res.success) {
        setSelectedRefund(null);
        fetchRefunds();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update refund');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = refunds.filter(
    (r) =>
      r.refundId?.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      r.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Refunds & Returns Governance"
        subtitle="Customer order refunds, gateway refund tracking, and ledger reconciliation"
        onRefresh={() => fetchRefunds(true)}
        refreshing={refreshing}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Search */}
        <div className="bg-[#051716] border border-emerald-950 p-3.5 rounded-2xl flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Refund ID, Order ID, Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#051716] border border-emerald-950/90 rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#03100f] border-b border-emerald-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4 font-bold">Refund ID</th>
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Reason</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Gateway Ref</th>
                <th className="py-3.5 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">Loading refunds...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">No refund requests recorded.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-emerald-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{r.refundId}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">#{r.orderId}</td>
                    <td className="py-3.5 px-4 text-slate-200">{r.userName || 'Customer'}</td>
                    <td className="py-3.5 px-4 font-black text-rose-400 font-mono text-sm">
                      ₹{Number(r.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[180px] truncate">{r.reason}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                          r.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{r.gatewayRefundId || '—'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedRefund(r);
                          setModalStatus(r.status === 'REQUESTED' ? 'COMPLETED' : r.status);
                          setGatewayRefundId(r.gatewayRefundId || '');
                          setRemarks(r.remarks || '');
                        }}
                        className="px-3 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold rounded-lg border border-emerald-500/30 cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Refund Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white m-0">Process Refund #{selectedRefund.refundId}</h4>
            <p className="text-slate-400 m-0">
              Order #{selectedRefund.orderId} • Amount: ₹{Number(selectedRefund.amount).toFixed(2)}
            </p>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="APPROVED">APPROVED (Authorized for Gateway Execution)</option>
                  <option value="COMPLETED">COMPLETED (Gateway Refund Executed & Settled)</option>
                  <option value="REJECTED">REJECTED (Refund Request Denied)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Gateway Refund Reference (e.g. Razorpay rfnd_id)</label>
                <input
                  type="text"
                  placeholder="e.g. rfnd_123456789"
                  value={gatewayRefundId}
                  onChange={(e) => setGatewayRefundId(e.target.value)}
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Super Admin Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={actionLoading}
                onClick={handleProcessSubmit}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-none cursor-pointer"
              >
                {actionLoading ? 'Updating Refund...' : 'Confirm Update'}
              </button>
              <button
                onClick={() => setSelectedRefund(null)}
                className="py-2.5 px-4 bg-slate-800 text-slate-300 font-bold rounded-xl border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
