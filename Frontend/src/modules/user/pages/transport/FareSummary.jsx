import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, IndianRupee, Package, CreditCard, Loader2, AlertCircle, MapPin, Truck } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';
import { transportService } from '../../../../services/transportService';

const FareSummary = () => {
  const navigate = useNavigate();
  const { activeBooking, clearActiveBooking } = useTransport();

  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [fareEstimate, setFareEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(true);
  const [estimateError, setEstimateError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const paymentOptions = ['CASH', 'UPI', 'CARD', 'WALLET'];

  // Fetch real fare estimate from backend when page loads
  const fetchFareEstimate = useCallback(async () => {
    if (!activeBooking.vehicle || !activeBooking.pickup || !activeBooking.drop) return;

    try {
      setEstimateLoading(true);
      setEstimateError(null);

      const payload = {
        pickupLocation: {
          address: typeof activeBooking.pickup === 'string' ? activeBooking.pickup : activeBooking.pickup.address,
          lat: activeBooking.pickup?.lat ?? null,
          lng: activeBooking.pickup?.lng ?? null,
        },
        dropLocation: {
          address: typeof activeBooking.drop === 'string' ? activeBooking.drop : activeBooking.drop.address,
          lat: activeBooking.drop?.lat ?? null,
          lng: activeBooking.drop?.lng ?? null,
        },
        vehicleTypeId: activeBooking.vehicle._id,
      };

      const data = await transportService.getFareEstimate(payload);
      setFareEstimate(data.estimate);
    } catch (err) {
      console.error('Fare estimate failed:', err);
      setEstimateError(err?.message || 'Could not calculate fare. Please try again.');
    } finally {
      setEstimateLoading(false);
    }
  }, [activeBooking.vehicle, activeBooking.pickup, activeBooking.drop]);

  useEffect(() => {
    fetchFareEstimate();
  }, [fetchFareEstimate]);

  // Create booking via API
  const handleBookVehicle = async () => {
    if (bookingLoading) return;
    setBookingLoading(true);
    setBookingError(null);

    try {
      const pickupAddr = typeof activeBooking.pickup === 'string' ? activeBooking.pickup : activeBooking.pickup?.address;
      const dropAddr = typeof activeBooking.drop === 'string' ? activeBooking.drop : activeBooking.drop?.address;

      const payload = {
        pickupLocation: {
          address: pickupAddr,
          landmark: activeBooking.pickup?.landmark || '',
          city: activeBooking.pickup?.city || '',
          state: activeBooking.pickup?.state || '',
          pincode: activeBooking.pickup?.pincode || '',
          lat: activeBooking.pickup?.lat ?? null,
          lng: activeBooking.pickup?.lng ?? null,
        },
        dropLocation: {
          address: dropAddr,
          landmark: activeBooking.drop?.landmark || '',
          city: activeBooking.drop?.city || '',
          state: activeBooking.drop?.state || '',
          pincode: activeBooking.drop?.pincode || '',
          lat: activeBooking.drop?.lat ?? null,
          lng: activeBooking.drop?.lng ?? null,
        },
        stops: (activeBooking.stops || []).filter(Boolean).map(s =>
          typeof s === 'string' ? { address: s } : s
        ),
        goods: {
          category: activeBooking.goods?.category,
          weightKg: parseFloat(activeBooking.goods?.weight) || 1,
          packages: parseInt(activeBooking.goods?.packages) || 1,
          instructions: activeBooking.goods?.instructions || '',
        },
        vehicleTypeId: activeBooking.vehicle._id,
        paymentMethod,
      };

      const result = await transportService.createBooking(payload);

      // Clear the draft and go to success page with real booking ID
      clearActiveBooking();
      navigate('/transport/success', {
        state: { bookingId: result.booking.bookingId, booking: result.booking }
      });
    } catch (err) {
      console.error('Booking creation failed:', err);
      setBookingError(err?.message || 'Booking failed. Please try again.');
      setBookingLoading(false);
    }
  };

  // Guard: redirect if no vehicle selected
  if (!activeBooking.vehicle) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-5 text-center">
        <h2 className="text-[18px] font-bold text-slate-800 mb-2">No Booking Data</h2>
        <p className="text-[14px] text-slate-500 mb-6">Please start your booking from the Transport Home.</p>
        <button className="bg-[#047857] text-white px-6 py-2 rounded-lg font-bold" onClick={() => navigate('/transport')}>Go Home</button>
      </div>
    );
  }

  const pickupText = typeof activeBooking.pickup === 'string' ? activeBooking.pickup : activeBooking.pickup?.address;
  const dropText = typeof activeBooking.drop === 'string' ? activeBooking.drop : activeBooking.drop?.address;
  const fare = fareEstimate?.fareBreakdown;
  const totalFare = fare?.totalFare || 0;

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Fare Summary</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-[100px] [&::-webkit-scrollbar]:hidden flex flex-col gap-4">

        {/* Locations */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
          <div className="flex flex-col items-center mt-1.5 mb-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#047857] shrink-0"></div>
            {activeBooking.stops && activeBooking.stops.filter(Boolean).map((_, sIdx) => (
              <React.Fragment key={`dot_${sIdx}`}>
                <div className="w-0.5 flex-1 min-h-[14px] bg-slate-200 my-0.5"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
              </React.Fragment>
            ))}
            <div className="w-0.5 flex-1 min-h-[14px] bg-slate-200 my-0.5"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-[#ff5500] shrink-0"></div>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-3 py-0.5">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup</span>
              <span className="text-[14px] font-semibold text-slate-800">{pickupText}</span>
            </div>
            {activeBooking.stops && activeBooking.stops.filter(Boolean).map((stopAddr, sIdx) => (
              <div key={`stop_${sIdx}`} className="flex flex-col">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Stop {sIdx + 1}</span>
                <span className="text-[14px] font-semibold text-slate-800">{typeof stopAddr === 'string' ? stopAddr : stopAddr.address}</span>
              </div>
            ))}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Drop</span>
              <span className="text-[14px] font-semibold text-slate-800">{dropText}</span>
            </div>
          </div>
        </div>

        {/* Vehicle & Goods */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 border border-slate-100">
              <Truck size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[14px] font-bold text-slate-800 m-0 mb-0.5">{activeBooking.vehicle.name}</h3>
              <span className="text-[12px] text-slate-500 flex items-center gap-1">
                <Package size={12} /> {activeBooking.goods?.category} • {activeBooking.goods?.weight}KG
              </span>
            </div>
          </div>
          {fareEstimate && (
            <div className="text-[13px] font-bold text-[#ff5500] bg-orange-50 px-2 py-1 rounded">
              {fareEstimate.distanceKm} KM
            </div>
          )}
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-800 mb-4">Fare Breakdown</h3>

          {estimateLoading && (
            <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-[13px]">Calculating fare...</span>
            </div>
          )}

          {estimateError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mb-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[12px] text-red-600">{estimateError}</span>
                <button onClick={fetchFareEstimate} className="block text-[12px] font-bold text-red-600 underline mt-1 bg-transparent border-none cursor-pointer p-0">Retry</button>
              </div>
            </div>
          )}

          {fare && !estimateLoading && (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] text-slate-600">Base Fare</span>
                <span className="text-[13px] font-medium text-slate-800">₹{fare.baseFare}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] text-slate-600">Distance Charge ({fareEstimate.distanceKm} km)</span>
                <span className="text-[13px] font-medium text-slate-800">₹{fare.distanceCharge}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] text-slate-600">Platform Fee</span>
                <span className="text-[13px] font-medium text-slate-800">₹{fare.platformFee}</span>
              </div>
              {fare.discount > 0 && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[13px] text-emerald-600">Discount</span>
                  <span className="text-[13px] font-medium text-emerald-600">−₹{fare.discount}</span>
                </div>
              )}
              <div className="w-full h-px bg-slate-100 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-bold text-slate-800">Total Amount</span>
                <span className="text-[18px] font-extrabold text-slate-900 flex items-center">
                  <IndianRupee size={16} strokeWidth={3} /> {totalFare}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
          <button
            className="flex items-center gap-3 w-full cursor-pointer bg-transparent border-none p-0 text-left"
            onClick={() => setPaymentOpen(o => !o)}
          >
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <CreditCard size={18} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Payment Method</span>
              <span className="text-[14px] font-bold text-slate-800">{paymentMethod}</span>
            </div>
            <span className="text-[12px] font-bold text-blue-600">Change</span>
          </button>

          {paymentOpen && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {paymentOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setPaymentMethod(opt); setPaymentOpen(false); }}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold border transition-all cursor-pointer ${paymentMethod === opt ? 'bg-[#047857] text-white border-[#047857]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* API booking error */}
        {bookingError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <span className="text-[13px] text-red-700">{bookingError}</span>
          </div>
        )}

      </div>

      {/* Book Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[90]">
        <button
          className={`w-full rounded-xl py-4 px-8 text-[16px] font-bold flex items-center justify-between cursor-pointer transition-all duration-200 ${!estimateLoading && !bookingLoading ? 'bg-[#047857] text-white shadow-[0_4px_12px_rgba(4,120,87,0.2)] active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          onClick={handleBookVehicle}
          disabled={estimateLoading || bookingLoading || !!estimateError}
        >
          {bookingLoading ? (
            <span className="flex items-center gap-2 mx-auto">
              <Loader2 size={18} className="animate-spin" />
              Booking...
            </span>
          ) : (
            <>
              <span>Book Vehicle</span>
              {fare && (
                <span className="flex items-center text-[18px] font-black">
                  <IndianRupee size={16} strokeWidth={3} /> {totalFare}
                </span>
              )}
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default FareSummary;
