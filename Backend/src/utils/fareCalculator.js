/**
 * Fare Calculator
 * Calculates the final fare for a transport booking based on a
 * VehicleType document, distance in km, and centralized TransportPricing rules.
 *
 * Formula:
 *   distanceCharge = distanceKm × perKmFare
 *   waitingCharge  = waitingMinutes × waitingChargePerMin
 *   stopsCharge    = stopsCount × additionalStopCharge
 *   nightSurge     = (nightPeakActive ? (baseFare + distanceCharge) × (multiplier - 1) + flatSurge : 0)
 *   rawFare        = baseFare + distanceCharge + waitingCharge + stopsCharge + nightSurge
 *   cappedFare     = max(rawFare, minimumFare)
 *   totalFare      = max(0, cappedFare + platformFee - discount)
 *
 * @param {Object} vehicle - VehicleType document or snapshot from DB
 * @param {number} distanceKm - Calculated distance in km
 * @param {number|Object} [optionsOrDiscount=0] - Optional discount amount or options object:
 *        { discount, stopsCount, waitingMinutes, isNightPeak, transportPricing }
 * @returns {{ baseFare, perKmFare, distanceKm, distanceCharge, waitingMinutes, waitingCharge, stopsCount, stopsCharge, nightSurge, platformFee, discount, totalFare }}
 */
export const calculateFare = (vehicle, distanceKm, optionsOrDiscount = 0) => {
  const options = typeof optionsOrDiscount === 'number'
    ? { discount: optionsOrDiscount }
    : (optionsOrDiscount || {});

  const discount = Math.max(0, Number(options.discount || 0));
  const stopsCount = Math.max(0, Number(options.stopsCount || (Array.isArray(options.stops) ? options.stops.length : 0)));
  const waitingMinutes = Math.max(0, Number(options.waitingMinutes || 0));
  const dist = Math.max(0.1, Number(distanceKm || 0));
  const pricing = options.transportPricing || null;

  // Resolve base rates: fallback to vehicle values
  const baseFare = Number(vehicle?.baseFare ?? pricing?.baseFare ?? 50);
  const perKmFare = Number(vehicle?.perKmFare ?? pricing?.perKmFare ?? 15);
  const minimumFare = Number(vehicle?.minimumFare ?? pricing?.minimumFare ?? 60);
  const platformFee = Number(vehicle?.platformFee ?? pricing?.platformFee ?? 10);

  // Extra charges from centralized pricing
  const waitingRate = Number(pricing?.waitingChargePerMin ?? 0);
  const stopRate = Number(pricing?.additionalStopCharge ?? 0);

  const distanceCharge = Math.round(dist * perKmFare * 100) / 100;
  const waitingCharge = Math.round(waitingMinutes * waitingRate * 100) / 100;
  const stopsCharge = Math.round(stopsCount * stopRate * 100) / 100;

  // Night / Peak pricing
  let nightSurge = 0;
  const isNightPeak = Boolean(options.isNightPeak);
  if (isNightPeak && pricing?.nightPeakPricing?.enabled) {
    const mult = Number(pricing.nightPeakPricing.surgeMultiplier || 1.0);
    const flat = Number(pricing.nightPeakPricing.surgeFlat || 0);
    nightSurge = Math.round(((baseFare + distanceCharge) * Math.max(0, mult - 1) + flat) * 100) / 100;
  }

  const rawFare = baseFare + distanceCharge + waitingCharge + stopsCharge + nightSurge;
  const cappedFare = Math.max(rawFare, minimumFare);
  const totalFare = Math.max(0, Math.round((cappedFare + platformFee - discount) * 100) / 100);

  return {
    baseFare,
    perKmFare,
    distanceKm: dist,
    distanceCharge,
    waitingMinutes,
    waitingCharge,
    stopsCount,
    stopsCharge,
    nightSurge,
    platformFee,
    discount,
    totalFare,
  };
};

export default calculateFare;
