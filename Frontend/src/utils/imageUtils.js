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

export const getCategoryFallbackImage = (categoryName) => {
  const name = String(categoryName || '').toLowerCase().trim();
  if (name.includes('grain') || name.includes('flour') || name.includes('atta') || name.includes('rice') || name.includes('dal')) {
    return grainsImg;
  }
  if (name.includes('oil') || name.includes('ghee')) {
    return oilGheeImg;
  }
  if (name.includes('spice') || name.includes('masala') || name.includes('pepper') || name.includes('chilli')) {
    return masalaImg;
  }
  if (name.includes('sugar') || name.includes('sweet') || name.includes('salt') || name.includes('jaggery')) {
    return sugarImg;
  }
  if (name.includes('ready') || name.includes('cook') || name.includes('noodle') || name.includes('instant') || name.includes('snack') || name.includes('foot')) {
    return readyCookImg;
  }
  if (name.includes('home') || name.includes('clean') || name.includes('detergent') || name.includes('wash')) {
    return homeCareImg;
  }
  if (name.includes('personal') || name.includes('perfume') || name.includes('beauty') || name.includes('cosmetic') || name.includes('care') || name.includes('soap') || name.includes('shampoo')) {
    return personalCareImg;
  }
  if (name.includes('suit') || name.includes('cloth') || name.includes('wear') || name.includes('dress') || name.includes('fashion')) {
    return personalCareImg;
  }
  return groceryImg;
};

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

  // Rewrite legacy/stale cloud host upload paths (e.g. shippnex.onrender.com/uploads/...) to current backend
  const legacyUploadMatch = trimmed.match(/^https?:\/\/[^\/]+\/(uploads\/.*)$/);
  if (legacyUploadMatch && !trimmed.includes('cloudinary') && !trimmed.includes('unsplash') && !trimmed.includes('imgur')) {
    return `${hostBase}/${legacyUploadMatch[1]}`;
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
