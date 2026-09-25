import grainsImg from '../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../assets/user/categories/Sugar-removebg-preview.png';
import groceryImg from '../assets/user/categories/Grocery-removebg-preview.png';
import readyCookImg from '../assets/user/categories/readyfoot-removebg-preview.png';
import homeCareImg from '../assets/user/categories/homecare-removebg-preview.png';
import personalCareImg from '../assets/user/categories/personalcare-removebg-preview.png';

export {
  grainsImg,
  oilGheeImg,
  masalaImg,
  sugarImg,
  groceryImg,
  readyCookImg,
  homeCareImg,
  personalCareImg
};

/**
 * Extract first single letter/character of category/product name.
 * Handles English letters, Hindi/Devanagari, Numbers, etc.
 */
export const getNameInitial = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const clean = name.trim();
  if (!clean) return '?';

  // Find the first alphanumeric or non-whitespace unicode character
  for (const char of clean) {
    if (/[a-zA-Z0-9\u0900-\u097F]/.test(char)) {
      return /[a-zA-Z]/.test(char) ? char.toUpperCase() : char;
    }
  }

  return clean.charAt(0).toUpperCase() || '?';
};

// Deterministic vibrant color palette for Letter Avatars
const AVATAR_PALETTES = [
  { bg: '#FF5500', text: '#FFFFFF' }, // Orange (Brand primary)
  { bg: '#0284C7', text: '#FFFFFF' }, // Sky Blue
  { bg: '#059669', text: '#FFFFFF' }, // Emerald
  { bg: '#7C3AED', text: '#FFFFFF' }, // Violet
  { bg: '#D97706', text: '#FFFFFF' }, // Amber
  { bg: '#E11D48', text: '#FFFFFF' }, // Rose
  { bg: '#0D9488', text: '#FFFFFF' }, // Teal
  { bg: '#4F46E5', text: '#FFFFFF' }, // Indigo
  { bg: '#EA580C', text: '#FFFFFF' }, // Deep Orange
  { bg: '#2563EB', text: '#FFFFFF' }, // Royal Blue
  { bg: '#0891B2', text: '#FFFFFF' }, // Cyan
  { bg: '#DB2777', text: '#FFFFFF' }, // Pink
  { bg: '#002625', text: '#FFFFFF' }, // Deep Teal (Brand dark)
];

export const getAvatarColor = (name) => {
  if (!name || typeof name !== 'string') return AVATAR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
};

/**
 * Generates an SVG Data URI displaying the single first letter of the name.
 * Never breaks, requires no network call, crisp at all resolutions.
 */
export const getInitialSvgDataUrl = (name, size = 120) => {
  const initial = getNameInitial(name);
  const { bg, text } = getAvatarColor(name);
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.46);

  // Clean SVG XML
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${radius}" fill="${bg}" />
    <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif" font-size="${fontSize}" font-weight="700" fill="${text}" text-anchor="middle" dominant-baseline="middle">${initial}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Only use built-in removebg assets for the 8 known seed system categories.
 * For any other custom category or missing image, return the Letter Avatar SVG.
 */
export const getCategoryFallbackImage = (categoryName) => {
  const name = String(categoryName || '').toLowerCase().trim();
  if (name === 'grains & flours' || name === 'grains and flours') {
    return grainsImg;
  }
  if (name === 'oil & ghee' || name === 'oil and ghee') {
    return oilGheeImg;
  }
  if (name === 'spices & masala' || name === 'spices and masala') {
    return masalaImg;
  }
  if (name === 'sugar & sweeteners' || name === 'sugar and sweeteners') {
    return sugarImg;
  }
  if (name === 'ready-to-cook' || name === 'ready to cook') {
    return readyCookImg;
  }
  if (name === 'home care' || name === 'homecare') {
    return homeCareImg;
  }
  if (name === 'personal care' || name === 'personalcare') {
    return personalCareImg;
  }
  if (name === 'grocery essentials') {
    return groceryImg;
  }

  // For any custom category without a real uploaded image, return the Letter Avatar
  return getInitialSvgDataUrl(categoryName || 'Category');
};

/**
 * Return letter avatar for product fallback (never a random grocery image).
 */
export const getProductFallbackImage = (name, category = '') => {
  return getInitialSvgDataUrl(name || category || 'Product');
};

/**
 * Helper to resolve dynamic or relative image paths (Cloudinary, local disk, or Letter Avatar SVG).
 */
export const getImageUrl = (url, nameOrFallback = '') => {
  if (!url || typeof url !== 'string') {
    return isLikelyUrl(nameOrFallback) ? nameOrFallback : getInitialSvgDataUrl(nameOrFallback || 'Item');
  }

  const trimmed = url.trim();
  if (
    !trimmed || 
    trimmed === 'undefined' || 
    trimmed === 'null' || 
    trimmed === '/uploads/categories/default.png' || 
    trimmed === '/uploads/products/default.png' ||
    trimmed === '/uploads/default.png'
  ) {
    return isLikelyUrl(nameOrFallback) ? nameOrFallback : getInitialSvgDataUrl(nameOrFallback || 'Item');
  }

  // Base64 or Blob URLs or SVG Data URIs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Handle core system category assets
  if (trimmed.includes('OilGhee-removebg-preview')) return oilGheeImg;
  if (trimmed.includes('grains-removebg-preview')) return grainsImg;
  if (trimmed.includes('masala-removebg-preview')) return masalaImg;
  if (trimmed.includes('Sugar-removebg-preview')) return sugarImg;
  if (trimmed.includes('readyfoot-removebg-preview')) return readyCookImg;
  if (trimmed.includes('homecare-removebg-preview')) return homeCareImg;
  if (trimmed.includes('personalcare-removebg-preview')) return personalCareImg;
  if (trimmed.includes('Grocery-removebg-preview')) return groceryImg;

  // Determine current backend base URL
  const apiBase = import.meta.env.VITE_API_URL || '';
  const defaultBackendHost = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5000` : 'http://localhost:5000';
  const hostBase = apiBase ? apiBase.replace(/\/api\/?$/, '') : defaultBackendHost;

  // Local uploads path: e.g. /uploads/... or uploads/... or /api/uploads/...
  if (trimmed.startsWith('/uploads') || trimmed.startsWith('uploads/') || trimmed.startsWith('/api/uploads')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed.replace(/^\/api\//, '/') : `/${trimmed}`;
    return `${hostBase}${cleanPath}`;
  }

  // Rewrite localhost / 127.0.0.1 or stale IP:5000 URLs to current backend host
  const localhostMatch = trimmed.match(/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+):5000(\/.*)$/);
  if (localhostMatch) {
    return `${hostBase}${localhostMatch[2]}`;
  }

  // Rewrite legacy/stale cloud host upload paths (e.g. shippnex.onrender.com/uploads/...) to current backend
  const legacyUploadMatch = trimmed.match(/^https?:\/\/[^\/]+(\/uploads\/.*)$/);
  if (legacyUploadMatch && !trimmed.includes('cloudinary') && !trimmed.includes('unsplash') && !trimmed.includes('imgur')) {
    return `${hostBase}${legacyUploadMatch[1]}`;
  }

  // Standard absolute URL (e.g. Cloudinary, Unsplash, external CDN)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Public frontend static asset path (e.g. /promo_banner_bg.png or /Logo.png)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
};

const isLikelyUrl = (str) => {
  if (!str || typeof str !== 'string') return false;
  return str.startsWith('/') || str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:') || str.startsWith('blob:');
};

/**
 * Reusable image error handler: switches to letter avatar on broken image load.
 */
export const handleImageError = (e, name) => {
  if (!e || !e.currentTarget) return;
  e.currentTarget.onerror = null;
  e.currentTarget.src = getInitialSvgDataUrl(name || 'Item');
};
