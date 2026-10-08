import API from '../services/api';

/**
 * Compress a data-URL or Blob for document uploads, then POST multipart
 * /api/upload so registration payment requests stay small (avoids nginx 413).
 */
export const dataUrlToBlob = (dataUrl) => {
  const parts = String(dataUrl).split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(parts[1] || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
};

export const compressImageFile = (fileOrBlob, { maxWidth = 1280, quality = 0.72 } = {}) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / Math.max(img.width, img.height || 1));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read image'));
    };
    img.src = objectUrl;
  });

export const uploadRegistrationImage = async (value, folder = 'misc') => {
  if (!value) return '';

  // Already a hosted URL — nothing to upload
  if (typeof value === 'string') {
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('/uploads/')
    ) {
      return value;
    }
    if (!value.startsWith('data:image/')) return value;
  }

  let rawBlob;
  if (typeof value === 'string' && value.startsWith('data:image/')) {
    rawBlob = dataUrlToBlob(value);
  } else if (typeof Blob !== 'undefined' && value instanceof Blob) {
    rawBlob = value;
  } else {
    return '';
  }

  const compressed = await compressImageFile(rawBlob);
  const formData = new FormData();
  formData.append('image', compressed, `doc-${Date.now()}.jpg`);

  const response = await API.post(`/upload?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const url = response?.data?.imageUrl || response?.data?.filePath || '';
  if (!url) throw new Error('Image upload did not return a URL');
  return url;
};
