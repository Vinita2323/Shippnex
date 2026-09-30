export function isDeliverableLocation(loc) {
  if (!loc || typeof loc !== 'object') return false;
  const line = String(loc.addressLine1 || loc.address || loc.formattedAddress || loc.area || loc.city || '').trim();
  if (!line) return false;
  const hasCoords = [loc.lat, loc.latitude, loc.lng, loc.longitude].some(
    (n) => n != null && n !== '' && Number(n) !== 0
  );
  if (hasCoords) return true;
  const normalized = line.toLowerCase();
  let accountName = '';
  try {
    accountName = String(localStorage.getItem('shippnex_user_name') || '').trim().toLowerCase();
  } catch (e) {}
  const isNameOnly = normalized === accountName || normalized === 'user' || normalized === 'customer' || normalized === 'sarah jenkins';
  if (isNameOnly) return false;
  const hasPin = String(loc.pincode || loc.zip || loc.postalCode || '').trim().length >= 4;
  return hasPin || /[0-9]/.test(line);
}

export function clearStoredUserLocation() {
  try {
    localStorage.removeItem('userLocation');
    window.dispatchEvent(new CustomEvent('shippnex_location_changed', { detail: null }));
  } catch (e) {}
}
