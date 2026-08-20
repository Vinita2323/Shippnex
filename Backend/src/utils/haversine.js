/**
 * Haversine Formula
 * Calculates the great-circle distance between two geographic points
 * on a sphere (Earth radius = 6371 km).
 *
 * @param {number} lat1 - Latitude of point 1 (degrees)
 * @param {number} lng1 - Longitude of point 1 (degrees)
 * @param {number} lat2 - Latitude of point 2 (degrees)
 * @param {number} lng2 - Longitude of point 2 (degrees)
 * @returns {number} Distance in kilometers (2 decimal places)
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // 2 decimal places
};

/**
 * Estimates travel duration based on distance.
 * Uses an average speed of 25 km/h for city transport vehicles.
 *
 * @param {number} distanceKm
 * @returns {number} Estimated duration in minutes (integer)
 */
export const estimateDuration = (distanceKm) => {
  const avgSpeedKmh = 25;
  const hours = distanceKm / avgSpeedKmh;
  const minutes = hours * 60;
  return Math.max(5, Math.round(minutes)); // minimum 5 minutes
};
