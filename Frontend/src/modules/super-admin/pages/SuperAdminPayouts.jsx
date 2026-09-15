import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Store,
  Truck,
  CreditCard,
  AlertCircle,
  Check,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
} from 'lucide-react';

export const SuperAdminPayouts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRecipientType = searchParams.get('tab') || 'ALL';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, processing: 0, paid: 0, rejected: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [recipientType, setRecipientType] = useState(initialRecipientType);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [recipientFinancials, setRecipientFinancials] = useState(null);

  // Action Modals State
  const [actionModal, setActionModal] = useState(null); // 'APPROVE' | 'REJECT' | 'PROCESS'
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchPayouts = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await superAdminService.getPayouts({
          page,
          recipientType,
          status,
          search,
          startDate,
          endDate,
        });

        if (res.success) {
          setPayouts(res.payouts || []);
          if (res.counts) setCounts(res.counts);
          setPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Fetch payouts error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, recipientType, status, search, startDate, endDate]
  );

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  // Open detailed view modal & fetch recipient complete ledger stats
  const handleOpenDetail = async (payout) => {
    setSelectedPayout(payout);
    setDetailLoading(true);
    setRecipientFinancials(null);
    setActionError('');

    try {
      const res = await superAdminService.getPayoutById(payout._id);
      if (res.success) {
        setSelectedPayout(res.payout);
        setRecipientFinancials(res.recipientFinancials);
      }
    } catch (err) {
      console.warn('Failed to load recipient profile:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Submit Approval
  const handleApprove = async () => {
    if (!selectedPayout) return;
    setActionLoading(true);
    setActionError('');

    try {
      const amt = approvedAmount ? Number(approvedAmount) : selectedPayout.requestedAmount;
      const res = await superAdminService.approvePayout(selectedPayout._id, {
        approvedAmount: amt,
        remarks: actionRemarks,
      });

      if (res.success) {
        setActionModal(null);
        setSelectedPayout(null);
        fetchPayouts();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to approve payout');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Rejection
  const handleReject = async () => {
    if (!selectedPayout) return;
    if (!rejectionReason.trim()) {
      setActionError('Please specify the reason for rejecting this payout.');
      return;
    }

    setActionLoading(true);
    setActionError('');

    try {
      const res = await superAdminService.rejectPayout(selectedPayout._id, {
        rejectionReason,
        remarks: actionRemarks,
      });

      if (res.success) {
        setActionModal(null);
        setSelectedPayout(null);
        fetchPayouts();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to reject payout');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Process & Mark Paid
  const handleProcessPayment = async () => {
    if (!selectedPayout) return;
    if (!paymentReference.trim()) {
      setActionError('Bank transfer reference (UTR / Payment ID) is required.');
      return;
    }

    setActionLoading(true);
    setActionError('');

    try {
      const res = await superAdminService.processPayout(selectedPayout._id, {
        paymentReference,
        paymentMethod,
        remarks: actionRemarks,
      });

      if (res.success) {
        setActionModal(null);
        setSelectedPayout(null);
        fetchPayouts();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to process payout');
    } finally {
      setActionLoading(false);
    }
  };

  const statusTabs = [
    { id: 'ALL', label: 'All Payouts', count: counts.all },
    { id: 'PENDING', label: 'Pending', count: counts.pending },
    { id: 'APPROVED', label: 'Approved', count: counts.approved },
    { id: 'PAID', label: 'Completed / Paid', count: counts.paid },
    { id: 'REJECTED', label: 'Rejected', count: counts.rejected },
  ];

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Payout Requests Governance"
        subtitle="Exclusive authorization, review, and bank settlement execution for Sellers and Captains"
        onRefresh={() => fetchPayouts(true)}
        refreshing={refreshing}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Recipient Type Tabs & Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
          <div className="flex items-center gap-2 bg-[#051716] p-1.5 rounded-2xl border border-emerald-950">
            {['ALL', 'SELLER', 'CAPTAIN'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setRecipientType(tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                  recipientType === tab
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-white bg-transparent'
                }`}
              >
                {tab === 'ALL' ? 'All Recipients' : tab === 'SELLER' ? 'Sellers Only' : 'Captains Only'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {statusTabs.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setStatus(st.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 ${
                  status === st.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#051716] text-slate-400 hover:text-white border border-emerald-950'
                }`}
              >
                <span>{st.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-slate-300 font-mono">
                  {st.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Date Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Payout ID, Recipient Name, Phone, UTR..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#051716] border border-emerald-950 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#051716] border border-emerald-950 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#051716] border border-emerald-950 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-[#051716] border border-emerald-950/90 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#03100f] border-b border-emerald-950/90 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Payout ID</th>
                  <th className="py-3.5 px-4 font-bold">Party</th>
                  <th className="py-3.5 px-4 font-bold">Requested</th>
                  <th className="py-3.5 px-4 font-bold">Approved</th>
                  <th className="py-3.5 px-4 font-bold">Bank / Destination</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Requested Date</th>
                  <th className="py-3.5 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Loading payout requests...
                    </td>
                  </tr>
                ) : payouts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No payout requests found matching the active filters.
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => {
                    const isSeller = p.recipientType === 'SELLER';
                    return (
                      <tr key={p._id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{p.payoutId}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1 rounded-md ${
                                isSeller ? 'bg-purple-500/10 text-purple-400' : 'bg-indigo-500/10 text-indigo-400'
                              }`}
                            >
                              {isSeller ? <Store size={14} /> : <Truck size={14} />}
                            </span>
                            <div>
                              <p className="font-bold text-white m-0">{p.recipientName || 'Partner'}</p>
                              <p className="text-[10.5px] text-slate-400 m-0 font-mono">{p.recipientPhone || p.recipientType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-white font-mono text-sm">
                          ₹{Number(p.requestedAmount).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-bold font-mono text-slate-300">
                          {p.approvedAmount ? `₹${Number(p.approvedAmount).toFixed(2)}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {p.bankDetails?.bankName ? (
                            <div>
                              <span className="font-medium text-white">{p.bankDetails.bankName}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                ****{(p.bankDetails.accountNumber || '').slice(-4)} ({p.bankDetails.ifscCode})
                              </span>
                            </div>
                          ) : p.bankDetails?.upiId ? (
                            <span className="font-mono text-emerald-400">{p.bankDetails.upiId}</span>
                          ) : (
                            <span className="text-slate-500 font-mono">No details</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] font-mono ${
                              p.status === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : p.status === 'APPROVED'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : p.status === 'PENDING'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : p.status === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(p.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenDetail(p)}
                            className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold rounded-xl border border-emerald-500/30 cursor-pointer transition-all"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-[#03100f] border-t border-emerald-950/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
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

      {/* Payout Detail & Review Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl shadow-black space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-950/80 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  PAYOUT REQUEST VERIFICATION
                </span>
                <h3 className="text-xl font-bold text-white m-0">#{selectedPayout.payoutId}</h3>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
                {actionError}
              </div>
            )}

            {/* Recipient Profile & Complete Financial Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#020b0b] p-4 rounded-2xl border border-emerald-950 space-y-2 text-xs">
                <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Recipient Profile
                </span>
                <p className="font-bold text-white text-sm m-0">{selectedPayout.recipientName}</p>
                <p className="text-slate-300 font-mono m-0">Phone: {selectedPayout.recipientPhone || 'N/A'}</p>
                <p className="text-emerald-400 font-semibold m-0 capitalize">Role: {selectedPayout.recipientType}</p>

                <div className="pt-2 border-t border-emerald-950/80 space-y-1">
                  <span className="text-slate-400 font-bold text-[10px] block uppercase">Bank Destination</span>
                  <p className="text-white font-semibold m-0">{selectedPayout.bankDetails?.bankName || 'Direct UPI'}</p>
                  <p className="text-slate-300 font-mono m-0">
                    A/C: {selectedPayout.bankDetails?.accountNumber || selectedPayout.bankDetails?.upiId}
                  </p>
                  {selectedPayout.bankDetails?.ifscCode && (
                    <p className="text-slate-400 font-mono m-0">IFSC: {selectedPayout.bankDetails?.ifscCode}</p>
                  )}
                </div>
              </div>

              {/* Financial Balance Summary */}
              <div className="bg-[#020b0b] p-4 rounded-2xl border border-emerald-950 space-y-2 text-xs">
                <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Financial Health & Balances
                </span>
                {detailLoading ? (
                  <p className="text-slate-400 py-4 text-center">Loading recipient ledgers...</p>
                ) : recipientFinancials ? (
                  <div className="space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available Balance:</span>
                      <span className="font-bold text-emerald-400">
                        ₹{Number(recipientFinancials.availableBalance).toFixed(2)}
                      </span>
                    </div>
                    {recipientFinancials.totalEarnings !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Order Earnings:</span>
                        <span className="text-white font-bold">
                          ₹{Number(recipientFinancials.totalEarnings).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {recipientFinancials.totalCommissionDeducted !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Commission:</span>
                        <span className="text-amber-400">
                          ₹{Number(recipientFinancials.totalCommissionDeducted).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {recipientFinancials.totalWithdrawn !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Previously Paid:</span>
                        <span className="text-blue-400 font-bold">
                          ₹{Number(recipientFinancials.totalWithdrawn).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No additional profile found</p>
                )}

                <div className="pt-2 border-t border-emerald-950/80">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-xs">Requested Payout:</span>
                    <span className="text-lg font-black text-white font-mono">
                      ₹{Number(selectedPayout.requestedAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Payout Status & Payment Ref if Paid */}
            <div className="p-3 bg-[#020b0b] rounded-2xl border border-emerald-950 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <span className="font-bold text-white font-mono text-sm">{selectedPayout.status}</span>
              </div>
              {selectedPayout.paymentReference && (
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Reference</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedPayout.paymentReference}</span>
                </div>
              )}
            </div>

            {/* Action Buttons for Super Admin */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-emerald-950/80">
              {selectedPayout.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setApprovedAmount(String(selectedPayout.requestedAmount));
                      setActionRemarks('');
                      setActionModal('APPROVE');
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Check size={16} />
                    <span>Approve Payout</span>
                  </button>
                  <button
                    onClick={() => {
                      setRejectionReason('');
                      setActionRemarks('');
                      setActionModal('REJECT');
                    }}
                    className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold rounded-xl border border-rose-500/40 cursor-pointer text-xs flex items-center gap-1.5 transition-all"
                  >
                    <X size={16} />
                    <span>Reject Payout</span>
                  </button>
                </>
              )}

              {selectedPayout.status === 'APPROVED' && (
                <button
                  onClick={() => {
                    setPaymentReference('');
                    setActionRemarks('');
                    setActionModal('PROCESS');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5 transition-all shadow-lg"
                >
                  <CreditCard size={16} />
                  <span>Execute Payment & Mark as Paid</span>
                </button>
              )}

              <button
                onClick={() => setSelectedPayout(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border-none cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal Dialog */}
      {actionModal === 'APPROVE' && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white m-0">Approve Payout #{selectedPayout.payoutId}</h4>
            <p className="text-slate-400 m-0">
              Confirm the authorized amount to release for {selectedPayout.recipientName}.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Approved Amount (₹)</label>
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Super Admin Remarks (Optional)</label>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="e.g. Verified against delivered orders"
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-none cursor-pointer"
              >
                {actionLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => setActionModal(null)}
                className="py-2.5 px-4 bg-slate-800 text-slate-300 font-bold rounded-xl border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal Dialog */}
      {actionModal === 'REJECT' && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-rose-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white m-0">Reject Payout #{selectedPayout.payoutId}</h4>
            <p className="text-slate-400 m-0">
              Rejecting will automatically restore ₹{Number(selectedPayout.requestedAmount).toFixed(2)} back to the recipient's available balance and generate an audited ledger reversal.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Rejection Reason (Required)</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Invalid bank account details or pending verification"
                  className="w-full bg-[#020b0b] border border-rose-950/80 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-none cursor-pointer"
              >
                {actionLoading ? 'Rejecting & Reversing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => setActionModal(null)}
                className="py-2.5 px-4 bg-slate-800 text-slate-300 font-bold rounded-xl border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Payment & Mark Paid Modal Dialog */}
      {actionModal === 'PROCESS' && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white m-0">Execute Payout Payment</h4>
            <p className="text-slate-400 m-0">
              Mark this approved payout as completed by recording the bank transfer or payment gateway reference.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="UPI">UPI Direct</option>
                  <option value="RAZORPAY_PAYOUT">Razorpay Payouts</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Reference / UTR / Gateway Txn ID</label>
                <input
                  type="text"
                  placeholder="e.g. UTR123456789012"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Additional transfer notes..."
                  className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={actionLoading}
                onClick={handleProcessPayment}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-none cursor-pointer"
              >
                {actionLoading ? 'Recording Settlement...' : 'Confirm & Mark as Paid'}
              </button>
              <button
                onClick={() => setActionModal(null)}
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
