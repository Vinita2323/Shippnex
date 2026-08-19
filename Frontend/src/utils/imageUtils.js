/**
 * Helper to resolve dynamic or relative image paths (e.g. from backend uploads, Cloudinary, local assets)
 * and provide a reliable fallback.
 */
export const getImageUrl = (url, fallback = '/promo_banner_bg.png') => {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  // Base64 or Blob URLs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Determine current backend base URL
  const apiBase = import.meta.env.VITE_API_URL || '';
  const defaultBackendHost = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5000` : 'http://localhost:5000';
  const hostBase = apiBase ? apiBase.replace(/\/api\/?$/, '') : defaultBackendHost;

  // Local uploads path: e.g. /uploads/... or uploads/...
  if (trimmed.startsWith('/uploads') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${hostBase}${cleanPath}`;
  }

  // If the stored URL contains localhost:5000 / 127.0.0.1:5000, rewrite host dynamically to match current frontend host
  const localhostMatch = trimmed.match(/^https?:\/\/(localhost|127\.0\.0\.1):5000(\/.*)$/);
  if (localhostMatch) {
    return `${hostBase}${localhostMatch[2]}`;
  }

  // Standard absolute URL (e.g. Cloudinary, Unsplash, external CDN)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Public frontend static asset path (e.g. /promo_banner_bg.png)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
};
