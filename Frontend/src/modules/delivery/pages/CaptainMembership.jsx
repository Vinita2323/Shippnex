import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, AlertTriangle, Star, Zap, Shield, CreditCard, RefreshCw, ChevronRight, Crown, Calendar, Receipt } from 'lucide-react';
import { membershipService } from '../../../services/authService';

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
  expired: { label: 'Expired', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
  pending_payment: { label: 'Pending Confirmation', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: XCircle },
  none: { label: 'No Membership', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: AlertTriangle },
};

const PLAN_ICONS = { monthly: Zap, halfYearly: Star, yearly: Crown };
const durationLabel = (t) => ({ monthly: '1 Month', halfYearly: '6 Months', yearly: '12 Months' }[t] || t);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const daysLeft = (exp) => {
  if (!exp) return null;
  const diff = new Date(exp) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const CaptainMembership = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [membership, setMembership] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('plans');

  const captainData = (() => { try { return JSON.parse(localStorage.getItem('shippnex_captain_data') || '{}'); } catch { return {}; } })();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, memRes, histRes] = await Promise.all([
        membershipService.getCaptainPlans().catch(() => ({ plans: [] })),
        membershipService.getCaptainMembership().catch(() => ({ membership: null })),
        membershipService.getCaptainMembershipHistory().catch(() => ({ memberships: [] })),
      ]);
      setPlans(plansRes.plans || []);
      setMembership(memRes.membership || null);
      setHistory(histRes.memberships || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan); setShowPaymentForm(true); setErrorMsg(''); setSuccessMsg('');
  };

  const handleSubmitPayment = async () => {
    if (!selectedPlan) return;
    setSubmitting(true); setErrorMsg('');
    try {
      const payload = { planId: selectedPlan._id, paymentReference: paymentRef, paymentMethod };
      const isRenewal = membership && ['active', 'expired'].includes(membership.membershipStatus);
      const fn = isRenewal ? membershipService.renewCaptainMembership : membershipService.purchaseCaptainMembership;
      const res = await fn(payload);
      if (res.success) {
        setSuccessMsg('Payment request submitted! Admin will verify and activate your membership within 24 hours.');
        setShowPaymentForm(false); setPaymentRef('');
        await loadData();
        setActiveTab('history');
      } else { setErrorMsg(res.message || 'Failed to submit'); }
    } catch (err) { setErrorMsg(err?.response?.data?.message || err.message || 'Error submitting payment'); }
    finally { setSubmitting(false); }
  };

  const currentStatus = membership?.membershipStatus || 'none';
  const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.none;
  const StatusIcon = statusCfg.icon;
  const isRenewal = membership && ['active', 'expired'].includes(membership.membershipStatus);
  const remaining = membership?.expiryDate ? daysLeft(membership.expiryDate) : null;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center"><div className="w-10 h-10 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div><p className="text-slate-500 font-medium text-sm">Loading...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/captain/dashboard')} className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent">
              <ChevronRight size={20} className="text-slate-500 rotate-180" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-800">Captain Membership</h1>
              <p className="text-xs text-slate-500 font-medium">{captainData.name || 'Your Store'}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
            <StatusIcon size={13} />{statusCfg.label}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-emerald-700">{successMsg}</p>
          </div>
        )}

        {/* Active Plan Card */}
        {membership?.membershipStatus === 'active' && (
          <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-3xl p-6 text-white shadow-xl shadow-sky-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sky-100 text-xs font-semibold uppercase tracking-wider mb-1">Active Plan</p>
                <h2 className="text-2xl font-black">{membership.planName}</h2>
                <p className="text-sky-200 text-sm font-medium">{durationLabel(membership.durationType)}</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-1"><Crown size={24} /></div>
                {remaining !== null && <p className="text-sky-100 text-xs font-bold">{remaining}d left</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-2xl p-4 mb-4">
              <div><p className="text-sky-200 text-xs font-semibold">Started</p><p className="text-white text-sm font-bold mt-0.5">{formatDate(membership.startDate)}</p></div>
              <div><p className="text-sky-200 text-xs font-semibold">Expires</p><p className="text-white text-sm font-bold mt-0.5">{formatDate(membership.expiryDate)}</p></div>
              <div><p className="text-sky-200 text-xs font-semibold">Paid</p><p className="text-white text-sm font-bold mt-0.5">₹{membership.priceAtPurchase?.toLocaleString()}</p></div>
            </div>
            {remaining !== null && remaining <= 30 && (
              <button onClick={() => setActiveTab('plans')} className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer border border-white/30">
                <RefreshCw size={14} className="inline mr-2" />Renew Now
              </button>
            )}
          </div>
        )}

        {/* Pending Notice */}
        {membership?.membershipStatus === 'pending_payment' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Awaiting Payment Verification</h3>
              <p className="text-amber-700 text-sm">Your payment for <strong>{membership.planName}</strong> is under review. Ref: <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">{membership.transactionId}</code></p>
            </div>
          </div>
        )}

        {/* Expired Notice */}
        {membership?.membershipStatus === 'expired' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800 mb-1">Membership Expired</h3>
              <p className="text-red-700 text-sm">Your <strong>{membership.planName}</strong> expired on {formatDate(membership.expiryDate)}. Renew to regain access to your captain panel.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1 gap-1">
          {[{ id: 'plans', label: 'Choose Plan' }, { id: 'history', label: 'Payment History' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${activeTab === t.id ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Plans */}
        {activeTab === 'plans' && (
          plans.length === 0 ? (
            <div className="text-center py-16 text-slate-400"><Shield size={40} className="mx-auto mb-3 opacity-30" /><p className="font-medium">No plans available</p></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {plans.map((plan) => {
                const PlanIcon = PLAN_ICONS[plan.durationType] || Star;
                const isPopular = plan.durationType === 'halfYearly';
                return (
                  <div key={plan._id} className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${isPopular ? 'border-[#0ea5e9] shadow-lg shadow-sky-100' : 'border-slate-200'}`}>
                    {isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0ea5e9] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md">MOST POPULAR</div>}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${isPopular ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky-300' : 'bg-slate-100 text-slate-600'}`}>
                      <PlanIcon size={22} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-5">{durationLabel(plan.durationType)}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-black text-slate-900">₹{plan.price?.toLocaleString()}</span>
                      <span className="text-slate-400 text-sm font-medium"> /{durationLabel(plan.durationType).toLowerCase()}</span>
                    </div>
                    {plan.description && <p className="text-xs text-slate-500 mb-5 leading-relaxed">{plan.description}</p>}
                    {plan.features?.length > 0 && (
                      <ul className="space-y-2.5 mb-6">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                            <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={membership?.membershipStatus === 'pending_payment'}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed ${isPopular ? 'bg-[#0ea5e9] text-white hover:bg-[#0369a1] shadow-lg shadow-sky-200' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                    >
                      {isRenewal ? 'Renew with this Plan' : 'Get Started'}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Membership & Payment History</h3>
              <span className="text-xs text-slate-400">{history.length} record{history.length !== 1 ? 's' : ''}</span>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400"><Receipt size={36} className="mx-auto mb-3 opacity-30" /><p className="font-medium text-sm">No records yet</p></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.map((h) => {
                  const sc = STATUS_CONFIG[h.membershipStatus] || STATUS_CONFIG.none;
                  const HIcon = sc.icon;
                  return (
                    <div key={h._id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sc.bg} border ${sc.border}`}><HIcon size={16} className={sc.color} /></div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{h.planName}</p>
                          <p className="text-xs text-slate-500">{formatDate(h.startDate)} → {formatDate(h.expiryDate)}</p>
                          <p className="text-xs text-slate-400 font-mono">{h.transactionId}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-black text-slate-800 text-sm mb-1">₹{h.priceAtPurchase?.toLocaleString()}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentForm && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800">Complete Payment</h2>
                <button onClick={() => setShowPaymentForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <div className="bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-100 rounded-2xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Selected Plan</p>
                <div className="flex items-center justify-between">
                  <div><p className="font-black text-slate-800">{selectedPlan.name}</p><p className="text-xs text-slate-500">{durationLabel(selectedPlan.durationType)}</p></div>
                  <p className="text-3xl font-black text-[#0ea5e9]">₹{selectedPlan.price?.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Bank Transfer', 'Cash'].map((m) => (
                    <button key={m} onClick={() => setPaymentMethod(m)} className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${paymentMethod === m ? 'border-[#0ea5e9] bg-sky-50 text-[#0ea5e9]' : 'border-slate-200 text-slate-600 bg-transparent hover:border-slate-300'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Transaction Reference / UTR <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input type="text" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Enter UTR, UPI ref, or transaction ID..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#0ea5e9] transition-colors" />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  <span className="font-bold block mb-1">📋 How it works:</span>
                  Submit this form after making payment of <strong>₹{selectedPlan.price?.toLocaleString()}</strong> to our account. Admin will verify and activate your membership within 24 hours.
                </p>
              </div>
              {errorMsg && <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl">{errorMsg}</p>}
              <button onClick={handleSubmitPayment} disabled={submitting} className="w-full py-4 bg-[#0ea5e9] hover:bg-[#0369a1] text-white font-black rounded-xl transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 border-none shadow-lg shadow-sky-200">
                {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Submitting...</> : <><CreditCard size={16} />Submit Payment Request</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainMembership;
