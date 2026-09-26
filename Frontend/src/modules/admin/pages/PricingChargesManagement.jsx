import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Truck,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  History,
  Calculator,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  Moon,
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  MapPin,
  HelpCircle,
  X,
  Loader2
} from 'lucide-react';
import pricingService from '../../../services/pricingService';

export const PricingChargesManagement = ({ initialTab = 'transport' }) => {
  // Top-Level Tab: 'transport' | 'delivery'
  const [activeTab, setActiveTab] = useState(
    initialTab === 'delivery' || initialTab === 'pricing_delivery' ? 'delivery' : 'transport'
  );

  // ── Data States ────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [transportActive, setTransportActive] = useState(null);
  const [transportList, setTransportList] = useState([]);
  const [deliveryActive, setDeliveryActive] = useState(null);
  const [deliveryList, setDeliveryList] = useState([]);

  // Toast / Feedback State
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 5000);
  };

  // ── Modals State ───────────────────────────────────────────────────────────
  // 'add_transport' | 'edit_transport' | 'add_delivery' | 'edit_delivery' | null
  const [modalMode, setModalMode] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [submittingModal, setSubmittingModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // History Modal
  const [historyModal, setHistoryModal] = useState({ open: false, title: '', history: [] });

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: '', name: '' });

  // ── Form State (Transport) ────────────────────────────────────────────────
  const [transportForm, setTransportForm] = useState({
    configName: '',
    description: '',
    baseFare: '50',
    perKmFare: '15',
    minimumFare: '60',
    waitingChargePerMin: '2',
    additionalStopCharge: '30',
    platformFee: '10',
    nightPeakEnabled: false,
    nightPeakMultiplier: '1.25',
    nightPeakFlat: '0',
    nightPeakStart: '22:00',
    nightPeakEnd: '06:00',
    nightPeakDescription: 'Late Night / Rush Hour Transport Surcharge',
    isActive: false,
    reason: '',
  });

  // ── Form State (Delivery) ─────────────────────────────────────────────────
  const [deliveryForm, setDeliveryForm] = useState({
    configName: '',
    description: '',
    baseDeliveryFee: '40',
    perKmDeliveryCharge: '5',
    minimumDeliveryFee: '40',
    freeDeliveryThreshold: '500',
    isFreeDeliveryEnabled: true,
    extraDistanceCharge: '10',
    thresholdDistanceKm: '5',
    peakSurgeEnabled: false,
    peakSurgeAmount: '20',
    peakSurgeMultiplier: '1.0',
    peakSurgeDescription: 'Peak / Bad Weather Delivery Surge',
    isActive: false,
    reason: '',
  });

  // ── Simulator States ───────────────────────────────────────────────────────
  // Transport Simulator
  const [simDist, setSimDist] = useState(8.5);
  const [simStops, setSimStops] = useState(1);
  const [simWait, setSimWait] = useState(15);
  const [simNight, setSimNight] = useState(false);

  // Delivery Simulator
  const [simCart, setSimCart] = useState(350);
  const [simDelivDist, setSimDelivDist] = useState(6.2);
  const [simSurge, setSimSurge] = useState(false);

  // ── Fetch Master Data ──────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await pricingService.getAdminPricingOverview();
      if (res && res.success) {
        setTransportActive(res.transport?.active || null);
        setTransportList(res.transport?.list || []);
        setDeliveryActive(res.delivery?.active || null);
        setDeliveryList(res.delivery?.list || []);
      }
    } catch (err) {
      console.error('Failed to load pricing configurations:', err);
      showFeedback('error', err?.response?.data?.message || 'Failed to load pricing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Open Add/Edit Modal Helpers ───────────────────────────────────────────
  const handleOpenAddTransport = () => {
    setTransportForm({
      configName: '',
      description: '',
      baseFare: '50',
      perKmFare: '15',
      minimumFare: '60',
      waitingChargePerMin: '2',
      additionalStopCharge: '30',
      platformFee: '10',
      nightPeakEnabled: false,
      nightPeakMultiplier: '1.25',
      nightPeakFlat: '0',
      nightPeakStart: '22:00',
      nightPeakEnd: '06:00',
      nightPeakDescription: 'Late Night / Rush Hour Transport Surcharge',
      isActive: false,
      reason: '',
    });
    setSelectedConfig(null);
    setFormErrors({});
    setModalMode('add_transport');
  };

  const handleOpenEditTransport = (config) => {
    setSelectedConfig(config);
    setTransportForm({
      configName: config.configName || '',
      description: config.description || '',
      baseFare: String(config.baseFare ?? '50'),
      perKmFare: String(config.perKmFare ?? '15'),
      minimumFare: String(config.minimumFare ?? '60'),
      waitingChargePerMin: String(config.waitingChargePerMin ?? '2'),
      additionalStopCharge: String(config.additionalStopCharge ?? '30'),
      platformFee: String(config.platformFee ?? '10'),
      nightPeakEnabled: Boolean(config.nightPeakPricing?.enabled),
      nightPeakMultiplier: String(config.nightPeakPricing?.surgeMultiplier ?? '1.25'),
      nightPeakFlat: String(config.nightPeakPricing?.surgeFlat ?? '0'),
      nightPeakStart: config.nightPeakPricing?.startHour || '22:00',
      nightPeakEnd: config.nightPeakPricing?.endHour || '06:00',
      nightPeakDescription: config.nightPeakPricing?.description || 'Late Night / Rush Hour Transport Surcharge',
      isActive: Boolean(config.isActive),
      reason: '',
    });
    setFormErrors({});
    setModalMode('edit_transport');
  };

  const handleOpenAddDelivery = () => {
    setDeliveryForm({
      configName: '',
      description: '',
      baseDeliveryFee: '40',
      perKmDeliveryCharge: '5',
      minimumDeliveryFee: '40',
      freeDeliveryThreshold: '500',
      isFreeDeliveryEnabled: true,
      extraDistanceCharge: '10',
      thresholdDistanceKm: '5',
      peakSurgeEnabled: false,
      peakSurgeAmount: '20',
      peakSurgeMultiplier: '1.0',
      peakSurgeDescription: 'Peak / Bad Weather Delivery Surge',
      isActive: false,
      reason: '',
    });
    setSelectedConfig(null);
    setFormErrors({});
    setModalMode('add_delivery');
  };

  const handleOpenEditDelivery = (config) => {
    setSelectedConfig(config);
    setDeliveryForm({
      configName: config.configName || '',
      description: config.description || '',
      baseDeliveryFee: String(config.baseDeliveryFee ?? '40'),
      perKmDeliveryCharge: String(config.perKmDeliveryCharge ?? '5'),
      minimumDeliveryFee: String(config.minimumDeliveryFee ?? '40'),
      freeDeliveryThreshold: String(config.freeDeliveryThreshold ?? '500'),
      isFreeDeliveryEnabled: config.isFreeDeliveryEnabled !== undefined ? Boolean(config.isFreeDeliveryEnabled) : true,
      extraDistanceCharge: String(config.extraDistanceCharge ?? '10'),
      thresholdDistanceKm: String(config.thresholdDistanceKm ?? '5'),
      peakSurgeEnabled: Boolean(config.peakSurge?.enabled),
      peakSurgeAmount: String(config.peakSurge?.surgeAmount ?? '20'),
      peakSurgeMultiplier: String(config.peakSurge?.surgeMultiplier ?? '1.0'),
      peakSurgeDescription: config.peakSurge?.description || 'Peak / Bad Weather Delivery Surge',
      isActive: Boolean(config.isActive),
      reason: '',
    });
    setFormErrors({});
    setModalMode('edit_delivery');
  };

  // ── Validation Helpers ────────────────────────────────────────────────────
  const validateTransportForm = () => {
    const errors = {};
    if (!transportForm.configName.trim()) errors.configName = 'Configuration name is required.';
    if (isNaN(Number(transportForm.baseFare)) || Number(transportForm.baseFare) < 0) {
      errors.baseFare = 'Base fare must be a positive number or 0.';
    }
    if (isNaN(Number(transportForm.perKmFare)) || Number(transportForm.perKmFare) < 0) {
      errors.perKmFare = 'Per KM fare must be a positive number or 0.';
    }
    if (isNaN(Number(transportForm.minimumFare)) || Number(transportForm.minimumFare) < 0) {
      errors.minimumFare = 'Minimum fare must be a positive number or 0.';
    }
    if (isNaN(Number(transportForm.waitingChargePerMin)) || Number(transportForm.waitingChargePerMin) < 0) {
      errors.waitingChargePerMin = 'Waiting charge must be a positive number or 0.';
    }
    if (isNaN(Number(transportForm.additionalStopCharge)) || Number(transportForm.additionalStopCharge) < 0) {
      errors.additionalStopCharge = 'Stop charge must be a positive number or 0.';
    }
    if (isNaN(Number(transportForm.platformFee)) || Number(transportForm.platformFee) < 0) {
      errors.platformFee = 'Platform fee must be a positive number or 0.';
    }
    if (transportForm.nightPeakEnabled) {
      if (isNaN(Number(transportForm.nightPeakMultiplier)) || Number(transportForm.nightPeakMultiplier) < 1) {
        errors.nightPeakMultiplier = 'Surge multiplier must be at least 1.0.';
      }
      if (isNaN(Number(transportForm.nightPeakFlat)) || Number(transportForm.nightPeakFlat) < 0) {
        errors.nightPeakFlat = 'Flat surge must be a positive number or 0.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDeliveryForm = () => {
    const errors = {};
    if (!deliveryForm.configName.trim()) errors.configName = 'Configuration name is required.';
    if (isNaN(Number(deliveryForm.baseDeliveryFee)) || Number(deliveryForm.baseDeliveryFee) < 0) {
      errors.baseDeliveryFee = 'Base delivery fee must be a positive number or 0.';
    }
    if (isNaN(Number(deliveryForm.perKmDeliveryCharge)) || Number(deliveryForm.perKmDeliveryCharge) < 0) {
      errors.perKmDeliveryCharge = 'Per KM charge must be a positive number or 0.';
    }
    if (isNaN(Number(deliveryForm.minimumDeliveryFee)) || Number(deliveryForm.minimumDeliveryFee) < 0) {
      errors.minimumDeliveryFee = 'Minimum delivery fee must be a positive number or 0.';
    }
    if (isNaN(Number(deliveryForm.freeDeliveryThreshold)) || Number(deliveryForm.freeDeliveryThreshold) < 0) {
      errors.freeDeliveryThreshold = 'Free delivery threshold must be a positive number or 0.';
    }
    if (isNaN(Number(deliveryForm.extraDistanceCharge)) || Number(deliveryForm.extraDistanceCharge) < 0) {
      errors.extraDistanceCharge = 'Extra distance charge must be a positive number or 0.';
    }
    if (isNaN(Number(deliveryForm.thresholdDistanceKm)) || Number(deliveryForm.thresholdDistanceKm) < 0) {
      errors.thresholdDistanceKm = 'Threshold distance must be a positive number or 0.';
    }
    if (deliveryForm.peakSurgeEnabled) {
      if (isNaN(Number(deliveryForm.peakSurgeAmount)) || Number(deliveryForm.peakSurgeAmount) < 0) {
        errors.peakSurgeAmount = 'Surge amount must be a positive number or 0.';
      }
      if (isNaN(Number(deliveryForm.peakSurgeMultiplier)) || Number(deliveryForm.peakSurgeMultiplier) < 1) {
        errors.peakSurgeMultiplier = 'Surge multiplier must be at least 1.0.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Form Submissions ──────────────────────────────────────────────────────
  const handleSaveTransport = async (e) => {
    e.preventDefault();
    if (!validateTransportForm()) return;

    try {
      setSubmittingModal(true);
      const payload = {
        configName: transportForm.configName.trim(),
        description: transportForm.description.trim(),
        baseFare: Number(transportForm.baseFare),
        perKmFare: Number(transportForm.perKmFare),
        minimumFare: Number(transportForm.minimumFare),
        waitingChargePerMin: Number(transportForm.waitingChargePerMin),
        additionalStopCharge: Number(transportForm.additionalStopCharge),
        platformFee: Number(transportForm.platformFee),
        nightPeakPricing: {
          enabled: transportForm.nightPeakEnabled,
          surgeMultiplier: Number(transportForm.nightPeakMultiplier || 1.25),
          surgeFlat: Number(transportForm.nightPeakFlat || 0),
          startHour: transportForm.nightPeakStart || '22:00',
          endHour: transportForm.nightPeakEnd || '06:00',
          description: transportForm.nightPeakDescription || 'Night / Peak hours surcharge',
        },
        isActive: transportForm.isActive,
        reason: transportForm.reason.trim() || undefined,
      };

      if (modalMode === 'add_transport') {
        const res = await pricingService.createTransportPricing(payload);
        if (res && res.success) {
          showFeedback('success', 'Transport pricing configuration created successfully!');
          setModalMode(null);
          await fetchData();
        }
      } else if (modalMode === 'edit_transport' && selectedConfig) {
        const res = await pricingService.updateTransportPricing(selectedConfig._id, payload);
        if (res && res.success) {
          showFeedback('success', 'Transport pricing configuration updated successfully!');
          setModalMode(null);
          await fetchData();
        }
      }
    } catch (err) {
      console.error('Error saving transport pricing:', err);
      showFeedback('error', err?.response?.data?.message || 'Failed to save transport pricing.');
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    if (!validateDeliveryForm()) return;

    try {
      setSubmittingModal(true);
      const payload = {
        configName: deliveryForm.configName.trim(),
        description: deliveryForm.description.trim(),
        baseDeliveryFee: Number(deliveryForm.baseDeliveryFee),
        perKmDeliveryCharge: Number(deliveryForm.perKmDeliveryCharge),
        minimumDeliveryFee: Number(deliveryForm.minimumDeliveryFee),
        freeDeliveryThreshold: Number(deliveryForm.freeDeliveryThreshold),
        isFreeDeliveryEnabled: deliveryForm.isFreeDeliveryEnabled,
        extraDistanceCharge: Number(deliveryForm.extraDistanceCharge),
        thresholdDistanceKm: Number(deliveryForm.thresholdDistanceKm),
        peakSurge: {
          enabled: deliveryForm.peakSurgeEnabled,
          surgeAmount: Number(deliveryForm.peakSurgeAmount || 0),
          surgeMultiplier: Number(deliveryForm.peakSurgeMultiplier || 1.0),
          description: deliveryForm.peakSurgeDescription || 'Peak / Bad Weather Delivery Surge',
        },
        isActive: deliveryForm.isActive,
        reason: deliveryForm.reason.trim() || undefined,
      };

      if (modalMode === 'add_delivery') {
        const res = await pricingService.createDeliveryPricing(payload);
        if (res && res.success) {
          showFeedback('success', 'Delivery pricing configuration created successfully!');
          setModalMode(null);
          await fetchData();
        }
      } else if (modalMode === 'edit_delivery' && selectedConfig) {
        const res = await pricingService.updateDeliveryPricing(selectedConfig._id, payload);
        if (res && res.success) {
          showFeedback('success', 'Delivery pricing configuration updated successfully!');
          setModalMode(null);
          await fetchData();
        }
      }
    } catch (err) {
      console.error('Error saving delivery pricing:', err);
      showFeedback('error', err?.response?.data?.message || 'Failed to save delivery pricing.');
    } finally {
      setSubmittingModal(false);
    }
  };

  // ── Activation Actions ────────────────────────────────────────────────────
  const handleActivateTransport = async (id) => {
    try {
      const res = await pricingService.activateTransportPricing(id);
      if (res && res.success) {
        showFeedback('success', res.message || 'Transport pricing plan activated.');
        await fetchData();
      }
    } catch (err) {
      showFeedback('error', err?.response?.data?.message || 'Failed to activate configuration.');
    }
  };

  const handleActivateDelivery = async (id) => {
    try {
      const res = await pricingService.activateDeliveryPricing(id);
      if (res && res.success) {
        showFeedback('success', res.message || 'Delivery pricing plan activated.');
        await fetchData();
      }
    } catch (err) {
      showFeedback('error', err?.response?.data?.message || 'Failed to activate configuration.');
    }
  };

  // ── Delete Actions ────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteConfirm.id || !deleteConfirm.type) return;
    try {
      if (deleteConfirm.type === 'transport') {
        await pricingService.deleteTransportPricing(deleteConfirm.id);
        showFeedback('success', 'Transport pricing configuration deleted.');
      } else {
        await pricingService.deleteDeliveryPricing(deleteConfirm.id);
        showFeedback('success', 'Delivery pricing configuration deleted.');
      }
      setDeleteConfirm({ open: false, type: '', id: '', name: '' });
      await fetchData();
    } catch (err) {
      showFeedback('error', err?.response?.data?.message || 'Failed to delete configuration.');
    }
  };

  // ── Live Simulator Computations ───────────────────────────────────────────
  // Transport Live Math
  const computeTransportSimulation = () => {
    const p = transportActive || {
      baseFare: 50,
      perKmFare: 15,
      minimumFare: 60,
      waitingChargePerMin: 2,
      additionalStopCharge: 30,
      platformFee: 10,
      nightPeakPricing: { enabled: false, surgeMultiplier: 1.25, surgeFlat: 0 },
    };

    const distCharge = Math.round(simDist * p.perKmFare * 100) / 100;
    const waitCharge = Math.round(simWait * p.waitingChargePerMin * 100) / 100;
    const stopCharge = Math.round(simStops * p.additionalStopCharge * 100) / 100;

    let nightSurge = 0;
    if (simNight && p.nightPeakPricing?.enabled) {
      const mult = p.nightPeakPricing.surgeMultiplier || 1.0;
      const flat = p.nightPeakPricing.surgeFlat || 0;
      nightSurge = Math.round(((p.baseFare + distCharge) * (mult - 1) + flat) * 100) / 100;
    }

    const raw = p.baseFare + distCharge + waitCharge + stopCharge + nightSurge;
    const capped = Math.max(raw, p.minimumFare);
    const total = Math.round((capped + (p.platformFee || 0)) * 100) / 100;

    return {
      baseFare: p.baseFare,
      perKmFare: p.perKmFare,
      distCharge,
      waitCharge,
      stopCharge,
      nightSurge,
      raw,
      minimumFare: p.minimumFare,
      platformFee: p.platformFee || 0,
      total,
    };
  };

  // Delivery Live Math
  const computeDeliverySimulation = () => {
    const p = deliveryActive || {
      baseDeliveryFee: 40,
      perKmDeliveryCharge: 5,
      minimumDeliveryFee: 40,
      freeDeliveryThreshold: 500,
      isFreeDeliveryEnabled: true,
      extraDistanceCharge: 10,
      thresholdDistanceKm: 5,
      peakSurge: { enabled: false, surgeAmount: 20, surgeMultiplier: 1.0 },
    };

    const isFree = simCart > 0 && p.isFreeDeliveryEnabled && simCart >= p.freeDeliveryThreshold;

    let extraDistCharge = 0;
    if (simDelivDist > p.thresholdDistanceKm) {
      extraDistCharge = Math.round((simDelivDist - p.thresholdDistanceKm) * p.extraDistanceCharge * 100) / 100;
    }

    let surgeFee = 0;
    if (simSurge && p.peakSurge?.enabled) {
      const mult = p.peakSurge.surgeMultiplier || 1.0;
      const flat = p.peakSurge.surgeAmount || 0;
      surgeFee = Math.round((p.baseDeliveryFee * (mult - 1) + flat) * 100) / 100;
    }

    const calculatedRaw = p.baseDeliveryFee + extraDistCharge + surgeFee;
    const finalFee = isFree ? 0 : Math.max(calculatedRaw, p.minimumDeliveryFee);

    return {
      baseDeliveryFee: p.baseDeliveryFee,
      isFree,
      thresholdDistanceKm: p.thresholdDistanceKm,
      extraDistCharge,
      surgeFee,
      minimumDeliveryFee: p.minimumDeliveryFee,
      finalFee: Math.round(finalFee * 100) / 100,
    };
  };

  const simTransportResult = computeTransportSimulation();
  const simDeliveryResult = computeDeliverySimulation();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans select-none">
      {/* ── Top Header & Tab Navigation ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-[#002625] text-[#ff5500] flex items-center justify-center shadow-md">
              <DollarSign size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 m-0 tracking-tight flex items-center gap-2">
                Pricing & Charges Manager
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
                  Live Engine
                </span>
              </h1>
              <p className="text-xs font-medium text-slate-500 m-0 mt-0.5">
                Centralized dynamic pricing matrix for freight transport rides and customer e-commerce deliveries.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-[#f1f5f9] p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('transport')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border-none cursor-pointer ${
              activeTab === 'transport'
                ? 'bg-[#002625] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Truck size={16} className={activeTab === 'transport' ? 'text-[#ff5500]' : 'text-slate-400'} />
            <span>Transport Charges</span>
            {transportActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border-none cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-[#002625] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Package size={16} className={activeTab === 'delivery' ? 'text-[#ff5500]' : 'text-slate-400'} />
            <span>Delivery Charges</span>
            {deliveryActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ── Toast Alert Banner ────────────────────────────────────────────── */}
      {feedback.text && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold animate-fadeIn shadow-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-700 p-1 border-none bg-transparent cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Loader2 size={36} className="text-[#ff5500] animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-700 m-0">Loading pricing matrices & active schedules...</p>
          <p className="text-xs text-slate-400 m-0 mt-1">Connecting to MongoDB pricing collections</p>
        </div>
      ) : activeTab === 'transport' ? (
        /* ====================================================================== */
        /* TAB 1: TRANSPORT CHARGES                                               */
        /* ====================================================================== */
        <div className="space-y-6">
          {/* Active Configuration Hero Card */}
          <div className="bg-gradient-to-br from-[#002625] via-[#003836] to-[#0b3d3b] text-white p-7 rounded-3xl border border-[#0d4a48] shadow-xl relative overflow-hidden">
            {/* Background Decorative Pattern */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#ff5500]/15 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-teal-500/20 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE TRANSPORT MATRIX
                    </span>
                    <span className="text-[11px] text-teal-300/80 font-mono">
                      Updated by {transportActive?.updatedBy || 'Admin'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white m-0 tracking-tight">
                    {transportActive?.configName || 'Standard Urban Logistics Rate Card'}
                  </h2>
                  <p className="text-xs text-teal-200/80 m-0 mt-1 max-w-xl">
                    {transportActive?.description || 'All transport booking fare calculations are dynamically derived from this active rate schedule.'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() =>
                      setHistoryModal({
                        open: true,
                        title: 'Transport Pricing Audit History',
                        history: transportActive?.history || [],
                      })
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-teal-100 text-xs font-bold border border-white/10 cursor-pointer transition-all"
                  >
                    <History size={15} />
                    <span>Audit Log</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditTransport(transportActive)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-bold border-none cursor-pointer shadow-lg transition-all"
                  >
                    <Edit3 size={15} />
                    <span>Edit Active Rates</span>
                  </button>

                  <button
                    onClick={handleOpenAddTransport}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white text-xs font-bold border border-teal-600/40 cursor-pointer transition-all"
                  >
                    <Plus size={15} />
                    <span>+ New Template</span>
                  </button>
                </div>
              </div>

              {/* Grid of Key Rate Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Base Fare
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {transportActive?.baseFare ?? 50}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Initial charge</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Per KM Charge
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {transportActive?.perKmFare ?? 15}
                    <span className="text-xs font-normal text-teal-300 ml-1">/km</span>
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Running distance</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Minimum Fare
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {transportActive?.minimumFare ?? 60}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Floor threshold</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Waiting / Min
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {transportActive?.waitingChargePerMin ?? 2}
                    <span className="text-xs font-normal text-teal-300 ml-1">/min</span>
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Driver idle time</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Stop Charge
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {transportActive?.additionalStopCharge ?? 30}
                    <span className="text-xs font-normal text-teal-300 ml-1">/stop</span>
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Multi-drop surcharge</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Night / Peak
                  </span>
                  <div className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                    {transportActive?.nightPeakPricing?.enabled ? (
                      <>
                        <Zap size={16} className="text-amber-400" />
                        <span>{transportActive.nightPeakPricing.surgeMultiplier}x Surge</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">Disabled</span>
                    )}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block truncate">
                    {transportActive?.nightPeakPricing?.enabled
                      ? `${transportActive.nightPeakPricing.startHour} - ${transportActive.nightPeakPricing.endHour}`
                      : 'Standard 24h rates'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Column Section: Live Simulator & Saved Configurations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Interactive Simulator (Left, 5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff5500] flex items-center justify-center">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 m-0">Live Transport Simulator</h3>
                    <p className="text-[11px] text-slate-400 m-0">Simulate booking fares with active rates</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSimDist(8.5);
                    setSimStops(1);
                    setSimWait(15);
                    setSimNight(false);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              {/* Sliders / Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Trip Distance (KM)</span>
                    <span className="text-[#ff5500] font-mono">{simDist} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={simDist}
                    onChange={(e) => setSimDist(parseFloat(e.target.value))}
                    className="w-full accent-[#ff5500] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Additional Stops</label>
                    <select
                      value={simStops}
                      onChange={(e) => setSimStops(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#ff5500]"
                    >
                      <option value="0">0 (Direct Trip)</option>
                      <option value="1">1 Stop (+₹{transportActive?.additionalStopCharge || 30})</option>
                      <option value="2">2 Stops (+₹{(transportActive?.additionalStopCharge || 30) * 2})</option>
                      <option value="3">3 Stops (+₹{(transportActive?.additionalStopCharge || 30) * 3})</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Waiting Time (Mins)</label>
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={simWait}
                      onChange={(e) => setSimWait(Math.max(0, parseInt(e.target.value || '0', 10)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                </div>

                {/* Night Peak Switch in Simulator */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Moon size={16} className={simNight ? 'text-indigo-600' : 'text-slate-400'} />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Night / Peak Surge</span>
                      <span className="text-[10px] text-slate-400">
                        {transportActive?.nightPeakPricing?.enabled
                          ? `${transportActive.nightPeakPricing.surgeMultiplier}x Active`
                          : 'Feature is disabled in active config'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={simNight}
                    onChange={(e) => setSimNight(e.target.checked)}
                    disabled={!transportActive?.nightPeakPricing?.enabled}
                    className="w-4 h-4 accent-[#ff5500] cursor-pointer"
                  />
                </div>
              </div>

              {/* Computed Simulation Output Breakdown */}
              <div className="bg-[#002625] text-white p-4 rounded-2xl border border-[#0d4a48] space-y-2.5">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                  Calculated Fare Breakdown
                </span>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Fare:</span>
                    <span className="font-mono font-bold text-white">₹{simTransportResult.baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Charge ({simDist} km × ₹{simTransportResult.perKmFare}):</span>
                    <span className="font-mono font-bold text-white">₹{simTransportResult.distCharge.toFixed(2)}</span>
                  </div>
                  {simTransportResult.waitCharge > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Waiting Charge ({simWait} min):</span>
                      <span className="font-mono font-bold">+₹{simTransportResult.waitCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {simTransportResult.stopCharge > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Stops Charge ({simStops} stop):</span>
                      <span className="font-mono font-bold">+₹{simTransportResult.stopCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {simTransportResult.nightSurge > 0 && (
                    <div className="flex justify-between text-indigo-300">
                      <span>Night Surge:</span>
                      <span className="font-mono font-bold">+₹{simTransportResult.nightSurge.toFixed(2)}</span>
                    </div>
                  )}
                  {simTransportResult.platformFee > 0 && (
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span className="font-mono font-bold text-white">₹{simTransportResult.platformFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-teal-500/30 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Final Estimated Fare</span>
                    <span className="text-[10px] text-teal-400">Includes all fees & taxes</span>
                  </div>
                  <div className="text-2xl font-black text-[#ff5500] font-mono">
                    ₹{simTransportResult.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Transport Configurations Table (Right, 7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 m-0">Saved Transport Rate Cards</h3>
                    <p className="text-[11px] text-slate-400 m-0">
                      {transportList.length} saved schedule template{transportList.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleOpenAddTransport}
                  className="px-3 py-1.5 rounded-xl bg-[#002625] hover:bg-[#003836] text-white text-xs font-bold border-none cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Plus size={14} /> + New Preset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-xl">Plan Name</th>
                      <th className="py-2.5 px-3">Base / KM</th>
                      <th className="py-2.5 px-3">Min Fare</th>
                      <th className="py-2.5 px-3">Wait / Stop</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transportList.map((cfg) => {
                      const isActive = cfg.isActive;
                      return (
                        <tr key={cfg._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{cfg.configName}</span>
                              {isActive && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Plan" />
                              )}
                            </div>
                            {cfg.description && (
                              <p className="text-[10px] text-slate-400 font-normal m-0 truncate max-w-xs">
                                {cfg.description}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                            ₹{cfg.baseFare} + ₹{cfg.perKmFare}/km
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                            ₹{cfg.minimumFare}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-600">
                            ₹{cfg.waitingChargePerMin}/m • ₹{cfg.additionalStopCharge}/stop
                          </td>
                          <td className="py-3 px-3">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                <Check size={11} className="stroke-[3]" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isActive && (
                                <button
                                  onClick={() => handleActivateTransport(cfg._id)}
                                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 cursor-pointer transition-colors"
                                  title="Make this active"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditTransport(cfg)}
                                className="p-1.5 text-slate-500 hover:text-[#ff5500] hover:bg-slate-100 rounded-lg border-none bg-transparent cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 size={15} />
                              </button>
                              {!isActive && (
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      type: 'transport',
                                      id: cfg._id,
                                      name: cfg.configName,
                                    })
                                  }
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ====================================================================== */
        /* TAB 2: DELIVERY CHARGES                                                */
        /* ====================================================================== */
        <div className="space-y-6">
          {/* Active Delivery Configuration Hero Card */}
          <div className="bg-gradient-to-br from-[#002625] via-[#003836] to-[#0b3d3b] text-white p-7 rounded-3xl border border-[#0d4a48] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#ff5500]/15 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-teal-500/20 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE DELIVERY RATE CARD
                    </span>
                    <span className="text-[11px] text-teal-300/80 font-mono">
                      Updated by {deliveryActive?.updatedBy || 'Admin'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white m-0 tracking-tight">
                    {deliveryActive?.configName || 'Standard E-Commerce Delivery Pricing'}
                  </h2>
                  <p className="text-xs text-teal-200/80 m-0 mt-1 max-w-xl">
                    {deliveryActive?.description || 'Applied automatically to customer cart, checkout, orders, and courier dispatches.'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() =>
                      setHistoryModal({
                        open: true,
                        title: 'Delivery Pricing Audit History',
                        history: deliveryActive?.history || [],
                      })
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-teal-100 text-xs font-bold border border-white/10 cursor-pointer transition-all"
                  >
                    <History size={15} />
                    <span>Audit Log</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditDelivery(deliveryActive)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-bold border-none cursor-pointer shadow-lg transition-all"
                  >
                    <Edit3 size={15} />
                    <span>Edit Active Rates</span>
                  </button>

                  <button
                    onClick={handleOpenAddDelivery}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white text-xs font-bold border border-teal-600/40 cursor-pointer transition-all"
                  >
                    <Plus size={15} />
                    <span>+ New Template</span>
                  </button>
                </div>
              </div>

              {/* Grid of Key Rate Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Base Delivery Fee
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {deliveryActive?.baseDeliveryFee ?? 40}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Default standard fee</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Free Delivery At
                  </span>
                  <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-0.5">
                    <span className="text-lg text-emerald-500">₹</span>
                    {deliveryActive?.freeDeliveryThreshold ?? 500}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">
                    {deliveryActive?.isFreeDeliveryEnabled ? 'Active (Cart ≥ ₹Threshold)' : 'Disabled'}
                  </span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Standard Radius
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    {deliveryActive?.thresholdDistanceKm ?? 5}
                    <span className="text-xs font-normal text-teal-300 ml-1">km</span>
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Covered in base fee</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Extra KM Charge
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {deliveryActive?.extraDistanceCharge ?? 10}
                    <span className="text-xs font-normal text-teal-300 ml-1">/km</span>
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Beyond standard radius</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Minimum Fee
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-0.5">
                    <span className="text-lg text-[#ff5500]">₹</span>
                    {deliveryActive?.minimumDeliveryFee ?? 40}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">Minimum floor</span>
                </div>

                <div className="bg-[#001d1c]/80 border border-teal-500/25 p-4 rounded-2xl backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider block mb-1">
                    Rain / Surge
                  </span>
                  <div className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                    {deliveryActive?.peakSurge?.enabled ? (
                      <>
                        <Zap size={16} className="text-amber-400" />
                        <span>+₹{deliveryActive.peakSurge.surgeAmount || 20}</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">Disabled</span>
                    )}
                  </div>
                  <span className="text-[10px] text-teal-400/80 mt-1 block truncate">
                    {deliveryActive?.peakSurge?.description || 'Surge pricing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Column: Live Delivery Simulator & Saved Rate Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Delivery Simulator (Left, 5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff5500] flex items-center justify-center">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 m-0">Live Delivery Fee Simulator</h3>
                    <p className="text-[11px] text-slate-400 m-0">Simulate order shipping fees with active rules</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSimCart(350);
                    setSimDelivDist(6.2);
                    setSimSurge(false);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              {/* Sliders / Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Customer Cart Value (₹)</span>
                    <span className="text-[#ff5500] font-mono">₹{simCart}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="25"
                    value={simCart}
                    onChange={(e) => setSimCart(parseFloat(e.target.value))}
                    className="w-full accent-[#ff5500] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹0</span>
                    <span>Free at ₹{deliveryActive?.freeDeliveryThreshold || 500}</span>
                    <span>₹1500</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Delivery Distance (KM)</span>
                    <span className="text-[#ff5500] font-mono">{simDelivDist} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.5"
                    value={simDelivDist}
                    onChange={(e) => setSimDelivDist(parseFloat(e.target.value))}
                    className="w-full accent-[#ff5500] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 km</span>
                    <span>Radius: {deliveryActive?.thresholdDistanceKm || 5} km</span>
                    <span>25 km</span>
                  </div>
                </div>

                {/* Rain / Surge Switch */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className={simSurge ? 'text-amber-500' : 'text-slate-400'} />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Rain / Peak Surge</span>
                      <span className="text-[10px] text-slate-400">
                        {deliveryActive?.peakSurge?.enabled
                          ? `+₹${deliveryActive.peakSurge.surgeAmount || 20} Active`
                          : 'Disabled in active configuration'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={simSurge}
                    onChange={(e) => setSimSurge(e.target.checked)}
                    disabled={!deliveryActive?.peakSurge?.enabled}
                    className="w-4 h-4 accent-[#ff5500] cursor-pointer"
                  />
                </div>
              </div>

              {/* Computed Simulation Output Breakdown */}
              <div className="bg-[#002625] text-white p-4 rounded-2xl border border-[#0d4a48] space-y-2.5">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                  Delivery Charge Outcome
                </span>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Delivery Fee:</span>
                    <span className="font-mono font-bold text-white">₹{simDeliveryResult.baseDeliveryFee.toFixed(2)}</span>
                  </div>
                  {simDeliveryResult.extraDistCharge > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Extra Distance ({simDelivDist - simDeliveryResult.thresholdDistanceKm} km):</span>
                      <span className="font-mono font-bold">+₹{simDeliveryResult.extraDistCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {simDeliveryResult.surgeFee > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Surge Surcharge:</span>
                      <span className="font-mono font-bold">+₹{simDeliveryResult.surgeFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-300">
                    <span>Free Delivery Qualified:</span>
                    <span className="font-bold">{simDeliveryResult.isFree ? 'YES (100% Free)' : 'NO'}</span>
                  </div>
                </div>

                <div className="border-t border-teal-500/30 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Charged to Customer</span>
                    <span className="text-[10px] text-teal-400">Added to cart at checkout</span>
                  </div>
                  <div className="text-2xl font-black text-[#ff5500] font-mono">
                    {simDeliveryResult.finalFee === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `₹${simDeliveryResult.finalFee.toFixed(2)}`
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Delivery Configurations Table (Right, 7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 m-0">Saved Delivery Rate Cards</h3>
                    <p className="text-[11px] text-slate-400 m-0">
                      {deliveryList.length} saved schedule template{deliveryList.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleOpenAddDelivery}
                  className="px-3 py-1.5 rounded-xl bg-[#002625] hover:bg-[#003836] text-white text-xs font-bold border-none cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Plus size={14} /> + New Preset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-xl">Plan Name</th>
                      <th className="py-2.5 px-3">Base Fee</th>
                      <th className="py-2.5 px-3">Free Above</th>
                      <th className="py-2.5 px-3">Extra KM</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deliveryList.map((cfg) => {
                      const isActive = cfg.isActive;
                      return (
                        <tr key={cfg._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{cfg.configName}</span>
                              {isActive && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Plan" />
                              )}
                            </div>
                            {cfg.description && (
                              <p className="text-[10px] text-slate-400 font-normal m-0 truncate max-w-xs">
                                {cfg.description}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                            ₹{cfg.baseDeliveryFee}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-emerald-600">
                            {cfg.isFreeDeliveryEnabled ? `₹${cfg.freeDeliveryThreshold}` : 'Disabled'}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-600 font-mono">
                            +₹{cfg.extraDistanceCharge}/km (&gt;{cfg.thresholdDistanceKm}km)
                          </td>
                          <td className="py-3 px-3">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                <Check size={11} className="stroke-[3]" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isActive && (
                                <button
                                  onClick={() => handleActivateDelivery(cfg._id)}
                                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 cursor-pointer transition-colors"
                                  title="Make this active"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditDelivery(cfg)}
                                className="p-1.5 text-slate-500 hover:text-[#ff5500] hover:bg-slate-100 rounded-lg border-none bg-transparent cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 size={15} />
                              </button>
                              {!isActive && (
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      type: 'delivery',
                                      id: cfg._id,
                                      name: cfg.configName,
                                    })
                                  }
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* ADD / EDIT TRANSPORT MODAL                                              */}
      {/* ====================================================================== */}
      {(modalMode === 'add_transport' || modalMode === 'edit_transport') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn my-8">
            <div className="bg-[#002625] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#003836] text-[#ff5500] flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white m-0">
                    {modalMode === 'add_transport' ? 'Add New Transport Pricing Plan' : 'Edit Transport Pricing Plan'}
                  </h3>
                  <p className="text-[11px] text-teal-300 m-0">
                    Configure base fares, per KM distance rates, waiting, and stop charges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border-none bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTransport} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={transportForm.configName}
                  onChange={(e) => setTransportForm({ ...transportForm, configName: e.target.value })}
                  placeholder="e.g. Standard Freight Schedule 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-800 outline-none"
                />
                {formErrors.configName && (
                  <span className="text-[10px] text-rose-500 font-semibold">{formErrors.configName}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Description</label>
                <input
                  type="text"
                  value={transportForm.description}
                  onChange={(e) => setTransportForm({ ...transportForm, description: e.target.value })}
                  placeholder="e.g. Standard urban delivery rates for pickups and trucks"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs text-slate-700 outline-none"
                />
              </div>

              {/* Core Rates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Base Fare (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={transportForm.baseFare}
                    onChange={(e) => setTransportForm({ ...transportForm, baseFare: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                  {formErrors.baseFare && (
                    <span className="text-[10px] text-rose-500 font-semibold">{formErrors.baseFare}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Per KM Charge (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={transportForm.perKmFare}
                    onChange={(e) => setTransportForm({ ...transportForm, perKmFare: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                  {formErrors.perKmFare && (
                    <span className="text-[10px] text-rose-500 font-semibold">{formErrors.perKmFare}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Minimum Fare (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={transportForm.minimumFare}
                    onChange={(e) => setTransportForm({ ...transportForm, minimumFare: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                  {formErrors.minimumFare && (
                    <span className="text-[10px] text-rose-500 font-semibold">{formErrors.minimumFare}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Waiting / Min (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={transportForm.waitingChargePerMin}
                    onChange={(e) => setTransportForm({ ...transportForm, waitingChargePerMin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Additional Stop Charge (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={transportForm.additionalStopCharge}
                    onChange={(e) => setTransportForm({ ...transportForm, additionalStopCharge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Platform Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={transportForm.platformFee}
                    onChange={(e) => setTransportForm({ ...transportForm, platformFee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Night / Peak Pricing Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={16} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Night / Peak Surge Pricing</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={transportForm.nightPeakEnabled}
                      onChange={(e) => setTransportForm({ ...transportForm, nightPeakEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#ff5500]"
                    />
                    <span>Enable Surge</span>
                  </label>
                </div>

                {transportForm.nightPeakEnabled && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Multiplier (e.g. 1.25x)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.05"
                        value={transportForm.nightPeakMultiplier}
                        onChange={(e) => setTransportForm({ ...transportForm, nightPeakMultiplier: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Flat Surcharge (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={transportForm.nightPeakFlat}
                        onChange={(e) => setTransportForm({ ...transportForm, nightPeakFlat: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Start Time (24h)</label>
                      <input
                        type="text"
                        value={transportForm.nightPeakStart}
                        onChange={(e) => setTransportForm({ ...transportForm, nightPeakStart: e.target.value })}
                        placeholder="22:00"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">End Time (24h)</label>
                      <input
                        type="text"
                        value={transportForm.nightPeakEnd}
                        onChange={(e) => setTransportForm({ ...transportForm, nightPeakEnd: e.target.value })}
                        placeholder="06:00"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Set Active Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 font-medium">
                <input
                  type="checkbox"
                  id="makeActiveTransport"
                  checked={transportForm.isActive}
                  onChange={(e) => setTransportForm({ ...transportForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#ff5500] cursor-pointer"
                />
                <label htmlFor="makeActiveTransport" className="cursor-pointer">
                  <strong>Make this the live active transport rate card</strong> (will supersede current active schedule)
                </label>
              </div>

              {/* Reason / Admin note */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Audit Reason / Note</label>
                <input
                  type="text"
                  value={transportForm.reason}
                  onChange={(e) => setTransportForm({ ...transportForm, reason: e.target.value })}
                  placeholder="e.g. Adjusted per KM fare for high diesel price index"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className="px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-bold border-none cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingModal && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* ADD / EDIT DELIVERY MODAL                                               */}
      {/* ====================================================================== */}
      {(modalMode === 'add_delivery' || modalMode === 'edit_delivery') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn my-8">
            <div className="bg-[#002625] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#003836] text-[#ff5500] flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white m-0">
                    {modalMode === 'add_delivery' ? 'Add New Delivery Pricing Plan' : 'Edit Delivery Pricing Plan'}
                  </h3>
                  <p className="text-[11px] text-teal-300 m-0">
                    Configure customer parcel shipping fees, free delivery threshold, and extra radius charges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border-none bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDelivery} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliveryForm.configName}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, configName: e.target.value })}
                  placeholder="e.g. Standard E-Commerce Rate Card 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-800 outline-none"
                />
                {formErrors.configName && (
                  <span className="text-[10px] text-rose-500 font-semibold">{formErrors.configName}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Description</label>
                <input
                  type="text"
                  value={deliveryForm.description}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, description: e.target.value })}
                  placeholder="e.g. Default delivery rates for retail orders & groceries"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs text-slate-700 outline-none"
                />
              </div>

              {/* Core Delivery Rates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Base Delivery Fee (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={deliveryForm.baseDeliveryFee}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, baseDeliveryFee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                  {formErrors.baseDeliveryFee && (
                    <span className="text-[10px] text-rose-500 font-semibold">{formErrors.baseDeliveryFee}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Free Delivery Threshold (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={deliveryForm.freeDeliveryThreshold}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, freeDeliveryThreshold: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-emerald-600 outline-none font-mono"
                  />
                  {formErrors.freeDeliveryThreshold && (
                    <span className="text-[10px] text-rose-500 font-semibold">{formErrors.freeDeliveryThreshold}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Standard Radius (KM) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={deliveryForm.thresholdDistanceKm}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, thresholdDistanceKm: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Extra KM Surcharge (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={deliveryForm.extraDistanceCharge}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, extraDistanceCharge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Per KM Rate (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={deliveryForm.perKmDeliveryCharge}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, perKmDeliveryCharge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Minimum Delivery Fee (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={deliveryForm.minimumDeliveryFee}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, minimumDeliveryFee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#ff5500] text-xs font-bold text-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Free Delivery Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Enable Free Delivery Incentive</span>
                  <span className="text-[10px] text-emerald-700">
                    Customers get 100% free delivery when cart order value is &ge; ₹{deliveryForm.freeDeliveryThreshold}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={deliveryForm.isFreeDeliveryEnabled}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, isFreeDeliveryEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Peak Surge / Rain Surge Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-xs font-bold text-slate-900">Peak / Rain / Bad Weather Surcharge</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={deliveryForm.peakSurgeEnabled}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, peakSurgeEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#ff5500]"
                    />
                    <span>Enable Surge</span>
                  </label>
                </div>

                {deliveryForm.peakSurgeEnabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Surge Flat Fee (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={deliveryForm.peakSurgeAmount}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, peakSurgeAmount: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Surge Description</label>
                      <input
                        type="text"
                        value={deliveryForm.peakSurgeDescription}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, peakSurgeDescription: e.target.value })}
                        placeholder="Rain Surcharge"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Set Active Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 font-medium">
                <input
                  type="checkbox"
                  id="makeActiveDelivery"
                  checked={deliveryForm.isActive}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#ff5500] cursor-pointer"
                />
                <label htmlFor="makeActiveDelivery" className="cursor-pointer">
                  <strong>Make this the live active delivery rate card</strong> (will supersede current active schedule)
                </label>
              </div>

              {/* Reason / Admin note */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Audit Reason / Note</label>
                <input
                  type="text"
                  value={deliveryForm.reason}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, reason: e.target.value })}
                  placeholder="e.g. Updated base delivery fee and free shipping threshold"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className="px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-bold border-none cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingModal && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* AUDIT HISTORY MODAL                                                     */}
      {/* ====================================================================== */}
      {historyModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#002625] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} className="text-[#ff5500]" />
                <h3 className="text-sm font-bold text-white m-0">{historyModal.title}</h3>
              </div>
              <button
                onClick={() => setHistoryModal({ open: false, title: '', history: [] })}
                className="text-slate-400 hover:text-white p-1 rounded-lg border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto space-y-3">
              {historyModal.history.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 m-0">No past audit revisions found.</p>
              ) : (
                historyModal.history.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-800">{h.changedBy || 'Admin'}</span>
                      <span className="text-slate-400 font-mono">
                        {h.changedAt ? new Date(h.changedAt).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 m-0">{h.reason || 'Configuration updated'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                               */}
      {/* ====================================================================== */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0 mb-1">Delete Configuration?</h3>
              <p className="text-xs text-slate-500 m-0">
                Are you sure you want to permanently delete <strong>&ldquo;{deleteConfirm.name}&rdquo;</strong>?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm({ open: false, type: '', id: '', name: '' })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold border-none cursor-pointer shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingChargesManagement;
