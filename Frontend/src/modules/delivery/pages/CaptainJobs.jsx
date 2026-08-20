import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService } from '../../../services/authService';
import { transportService } from '../../../services/transportService';

const CaptainJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transport'); // default to transport requests
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedJob, setAcceptedJob] = useState(null);
  const [selectedDetailJob, setSelectedDetailJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchJobs = useCallback(async (tab) => {
    setLoading(true);
    try {
      if (tab === 'transport') {
        const res = await transportService.captainGetRequests();
        setTransportRequests(res.requests || []);
      } else {
        const res = await captainService.getJobs(tab);
        setJobs(res.orders || []);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
      if (tab === 'transport') setTransportRequests([]);
      else setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(activeTab);
  }, [activeTab, fetchJobs]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // Accept transport request
  const handleAcceptTransport = async (request) => {
    setActionLoading(request._id);
    try {
      const res = await transportService.captainAcceptRequest(request.bookingId || request._id);
      setAcceptedJob({
        ...request,
        orderId: request.bookingId,
        captainEarnings: request.estimatedEarnings,
        shippingAddress: { city: request.dropLocation?.city || request.dropLocation?.address },
        isTransport: true,
      });
      fetchJobs('transport');
    } catch (err) {
      console.error('Accept transport request error:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to accept transport request.');
    } finally {
      setActionLoading(null);
    }
  };

  // Reject transport request
  const handleRejectTransport = async (request) => {
    setActionLoading(request._id);
    try {
      await transportService.captainRejectRequest(request.bookingId || request._id);
      fetchJobs('transport');
    } catch (err) {
      console.error('Reject transport error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Accept normal delivery order
  const handleAcceptOrder = async (order) => {
    setActionLoading(order._id);
    try {
      await captainService.acceptJob(order.orderId || order._id);
      setAcceptedJob(order);
      fetchJobs(activeTab);
    } catch (err) {
      console.error('Accept job error:', err);
      alert(err?.response?.data?.message || 'Failed to accept job.');
    } finally {
      setActionLoading(null);
    }
  };

  // Reject normal delivery order
  const handleRejectOrder = async (order) => {
    setActionLoading(order._id);
    try {
      await captainService.rejectJob(order.orderId || order._id);
      fetchJobs(activeTab);
    } catch (err) {
      console.error('Reject job error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmJobAcceptance = () => {
    navigate('/captain/active-delivery');
  };

  // Normalize order data for delivery tabs
  const normalizeOrder = (order) => ({
    _id: order._id,
    orderId: order.orderId,
    captainStatus: order.captainStatus,
    captainEarnings: order.captainEarnings || 0,
    itemCount: order.items?.length || 0,
    customerName: order.user?.name || order.shippingAddress?.fullName || 'Customer',
    customerPhone: order.user?.phone || order.shippingAddress?.phone || '',
    dropAddress: order.shippingAddress?.addressLine1 || '',
    dropCity: order.shippingAddress?.city || '',
    dropState: order.shippingAddress?.state || '',
    items: order.items || [],
    deliverySlot: order.deliverySlot || {},
    assignedAt: order.captainAssignedAt,
  });

  const filteredJobs = jobs.filter((o) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      o.orderId?.toLowerCase().includes(q) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
      o.shippingAddress?.city?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q)
    );
  });

  const filteredTransport = transportRequests.filter((t) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      t.bookingId?.toLowerCase().includes(q) ||
      t.customerName?.toLowerCase().includes(q) ||
      t.pickupLocation?.address?.toLowerCase().includes(q) ||
      t.dropLocation?.address?.toLowerCase().includes(q) ||
      t.goods?.category?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    const map = {
      'In Transit': 'bg-[#ff6000]/15 text-[#ff6000]',
      'Picked Up': 'bg-amber-100 text-amber-800',
      'Accepted': 'bg-[#0a3d16] text-[#86efac]',
      'Assigned': 'bg-purple-100 text-purple-700',
      'Delivered': 'bg-emerald-100 text-emerald-800',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="bg-[#f8fafc] font-body-md text-slate-800 min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-3xl px-4 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
              Job Queue
            </h1>
            <p className="text-[10px] md:text-xs text-[#97fc43] font-medium tracking-wide uppercase mt-0.5">
              Available & Assigned Trips
            </p>
          </div>
          <button
            onClick={() => fetchJobs(activeTab)}
            className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-3.5 max-w-xl mx-auto space-y-3.5 mt-1">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Trip ID, Customer or Location..."
            className="w-full bg-white border border-slate-200/90 rounded-2xl py-2.5 pl-10 pr-3 text-xs font-medium shadow-2xs focus:ring-2 focus:ring-secondary/40 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-0.5">
          {[
            { key: 'transport', label: 'Transport Requests', icon: 'local_shipping', count: transportRequests.length },
            { key: 'deliveries', label: 'Active Orders', icon: 'package_2', count: jobs.length },
            { key: 'completed', label: 'Completed', icon: 'check_circle' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#366b00] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label} {tab.count !== undefined && !loading && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-5xl text-[#366b00] animate-spin">sync</span>
            <p className="text-sm text-slate-500 font-semibold">Loading available jobs…</p>
          </div>
        )}

        {/* ── TAB 1: TRANSPORT REQUESTS ── */}
        {!loading && activeTab === 'transport' && (
          <>
            {filteredTransport.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 flex flex-col items-center gap-3 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">local_shipping</span>
                <p className="font-bold text-slate-700">No New Transport Requests</p>
                <p className="text-xs text-slate-400">
                  When users in your area book a transport vehicle, ride requests will appear here in real-time.
                </p>
              </div>
            ) : (
              filteredTransport.map((req) => {
                const isActing = actionLoading === req._id;
                return (
                  <div
                    key={req._id}
                    className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    {/* Header: ID, Badge, Payout */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#15803d] flex items-center justify-center shadow-xs shrink-0">
                          <span className="material-symbols-outlined text-2xl">local_shipping</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-mono text-xs font-black text-slate-900 leading-none">
                              #{req.bookingId}
                            </h3>
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              Transport Request
                            </span>
                          </div>
                          <p className="font-bold text-xs text-slate-700 mt-1 truncate">
                            {req.goods?.category} • {req.goods?.weightKg} KG • {req.goods?.packages} Boxes
                          </p>
                        </div>
                      </div>
                      <p className="font-headline-md text-xl font-black text-[#15803d] shrink-0">
                        ₹{(req.estimatedEarnings || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Route Info */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <div>
                        <span className="font-black text-[9px] text-[#047857] uppercase tracking-wider block">
                          PICKUP
                        </span>
                        <p className="font-bold text-slate-900 leading-snug">{req.pickupLocation?.address}</p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/60">
                        <span className="font-black text-[9px] text-[#ff5500] uppercase tracking-wider block">
                          DROP
                        </span>
                        <p className="font-bold text-slate-900 leading-snug">{req.dropLocation?.address}</p>
                      </div>
                      {req.distanceKm && (
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-2 pt-1">
                          <span>📍 {req.distanceKm} km</span>
                          <span>⏱ ~{req.estimatedDurationMin || 15} mins</span>
                          <span>💳 {req.paymentMethod || 'CASH'}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions: Reject & Accept */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleRejectTransport(req)}
                        disabled={isActing}
                        className="flex-1 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptTransport(req)}
                        disabled={isActing}
                        className="flex-2 py-3 bg-[#366b00] hover:bg-[#2d5800] text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {isActing ? (
                          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-base">check_circle</span>
                        )}
                        {isActing ? 'Claiming Request…' : 'Accept Request'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ── TAB 2 & 3: DELIVERY ORDERS & COMPLETED ── */}
        {!loading && activeTab !== 'transport' && (
          <>
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 flex flex-col items-center gap-3 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">
                  {activeTab === 'completed' ? 'task_alt' : 'package_2'}
                </span>
                <p className="font-bold text-slate-700">
                  {activeTab === 'completed' ? 'No completed deliveries yet' : 'No active orders assigned'}
                </p>
                <p className="text-xs text-slate-400">
                  {activeTab === 'completed'
                    ? 'Your trip and delivery history will appear here.'
                    : 'Assigned e-commerce packages will appear here once online.'}
                </p>
              </div>
            ) : (
              filteredJobs.map((order) => {
                const job = normalizeOrder(order);
                const isActing = actionLoading === order._id;
                return (
                  <div
                    key={job._id}
                    className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5 overflow-hidden"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#d9f99d] text-[#365314] flex items-center justify-center shadow-xs shrink-0">
                          <span className="material-symbols-outlined text-xl">package_2</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-mono text-xs font-black text-slate-900 leading-none">
                            #{job.orderId}
                          </h3>
                          <p className="font-bold text-xs text-slate-700 mt-0.5 truncate">{job.customerName}</p>
                          <span
                            className={`text-[8px] font-black px-2 py-0.5 rounded-full ${getStatusBadge(
                              job.captainStatus
                            )}`}
                          >
                            {job.captainStatus?.toUpperCase() || 'ASSIGNED'}
                          </span>
                        </div>
                      </div>
                      <p className="font-headline-md text-xl font-black text-[#15803d] shrink-0">
                        ₹{job.captainEarnings.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div>
                        <span className="font-black text-[8px] text-slate-500 uppercase tracking-widest block">
                          DROP
                        </span>
                        <p className="font-bold text-slate-900 text-xs leading-tight truncate">{job.dropAddress}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {job.dropCity}, {job.dropState}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">inventory_2</span>
                        {job.itemCount} item{job.itemCount !== 1 ? 's' : ''}
                        {job.deliverySlot?.time ? ` • ${job.deliverySlot.time}` : ''}
                      </div>
                    </div>

                    {activeTab !== 'completed' && (
                      <div className="flex gap-2 pt-0.5">
                        <button
                          onClick={() => setSelectedDetailJob(order)}
                          className="w-1/2 bg-white border border-slate-200/90 py-2.5 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">description</span>
                          View Details
                        </button>

                        {job.captainStatus === 'Assigned' ? (
                          <button
                            onClick={() => handleAcceptOrder(order)}
                            disabled={isActing}
                            className="w-1/2 bg-[#366b00] hover:bg-[#2d5800] py-2.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer disabled:opacity-60"
                          >
                            {isActing ? (
                              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                            ) : (
                              'Accept Job'
                            )}
                            {!isActing && <span className="material-symbols-outlined text-base">arrow_forward</span>}
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/captain/active-delivery')}
                            className="w-1/2 bg-secondary hover:bg-secondary/90 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                          >
                            Continue
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </main>

      {/* Accept Confirmation Modal */}
      {acceptedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-[#15803d] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-xl font-bold">check_circle</span>
            </div>
            <div className="text-center space-y-0.5">
              <h3 className="font-bold text-lg text-slate-900">Job Accepted!</h3>
              <p className="text-xs text-slate-500">
                Payout: <span className="font-bold text-[#15803d]">₹{(acceptedJob.captainEarnings || 0).toFixed(2)}</span>
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1 border border-slate-100">
              <p className="font-bold text-slate-900">Trip #{acceptedJob.orderId || acceptedJob.bookingId}</p>
              <p className="text-slate-500">
                Destination: {acceptedJob.shippingAddress?.city || acceptedJob.dropLocation?.address}
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setAcceptedJob(null)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Stay Here
              </button>
              <button
                onClick={confirmJobAcceptance}
                className="flex-1 py-2.5 rounded-2xl bg-[#366b00] hover:bg-[#2d5800] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Start Navigation
              </button>
            </div>
          </div>
        </div>
      )}

      <CaptainBottomNav />
    </div>
  );
};

export default CaptainJobs;
