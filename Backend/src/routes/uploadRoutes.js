import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Supported subfolders for clean organization
const ALLOWED_FOLDERS = ['banners', 'products', 'categories', 'profiles', 'misc'];

// Configure Multer dynamic storage destination based on folder parameter
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let folder = req.query.folder || req.body.folder || 'banners';
    if (!ALLOWED_FOLDERS.includes(folder.toLowerCase())) {
      folder = 'misc';
    }

    const targetDir = path.join(process.cwd(), 'uploads', folder.toLowerCase());
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp, gif, svg)!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Helper to check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return Boolean(cloudName && cloudName !== 'your_cloud_name_here');
};

// Single File Upload Endpoint
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  let folder = req.query.folder || req.body.folder || 'banners';
  if (!ALLOWED_FOLDERS.includes(folder.toLowerCase())) {
    folder = 'misc';
  }

  // If Cloudinary is configured, upload to Cloudinary
  if (isCloudinaryConfigured()) {
    try {
      const uploadRes = await uploadToCloudinary(req.file.path, folder.toLowerCase());
      // Delete temporary local file after uploading to Cloudinary
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(200).json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        imageUrl: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        provider: 'cloudinary'
      });
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local file storage:', err.message);
    }
  }

  // Fallback to local storage URL
  const filename = req.file.filename;
  const relativePath = `uploads/${folder.toLowerCase()}/${filename}`;
  const fileUrl = `http://localhost:5000/${relativePath}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded locally',
    imageUrl: fileUrl,
    filePath: `/${relativePath}`,
    provider: 'local'
  });
});

// Base64 Image Upload Endpoint for Cloudinary
router.post('/base64', async (req, res) => {
  try {
    const { image, folder = 'products' } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Base64 image string is required' });
    }

    if (isCloudinaryConfigured()) {
      const uploadRes = await uploadToCloudinary(image, folder.toLowerCase());
      return res.status(200).json({
        success: true,
        message: 'Base64 image uploaded to Cloudinary successfully',
        imageUrl: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        provider: 'cloudinary'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cloudinary not configured yet. Returning original data URL.',
      imageUrl: image,
      provider: 'base64'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading base64 image'
    });
  }
});

export default router;
