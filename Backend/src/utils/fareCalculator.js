/**
 * Fare Calculator
 * Calculates the final fare for a transport booking based on a
 * VehicleType document and a distance in km.
 *
 * Formula:
 *   distanceCharge = distanceKm × perKmFare
 *   rawFare        = baseFare + distanceCharge
 *   cappedFare     = max(rawFare, minimumFare)
 *   totalFare      = cappedFare + platformFee - discount
 *
 * @param {Object} vehicle - VehicleType document from DB
 * @param {number} distanceKm - Calculated distance in km
 * @param {number} [discount=0] - Optional discount amount in rupees
 * @returns {{ baseFare, distanceCharge, platformFee, discount, totalFare }}
 */
export const calculateFare = (vehicle, distanceKm, discount = 0) => {
  const baseFare = vehicle.baseFare;
  const perKmFare = vehicle.perKmFare;
  const minimumFare = vehicle.minimumFare;
  const platformFee = vehicle.platformFee;

  const distanceCharge = Math.round(distanceKm * perKmFare * 100) / 100;
  const rawFare = baseFare + distanceCharge;
  const cappedFare = Math.max(rawFare, minimumFare);
  const totalFare = Math.round((cappedFare + platformFee - discount) * 100) / 100;

  return {
    baseFare,
    distanceCharge,
    platformFee,
    discount,
    totalFare,
  };
};
