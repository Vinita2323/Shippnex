import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Supported subfolders for clean organization
const ALLOWED_FOLDERS = ['banners', 'products', 'categories', 'profiles', 'misc'];

// Configure Multer dynamic storage destination based on folder parameter
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Read folder parameter from query string or body (defaults to 'banners' or 'misc')
    let folder = req.query.folder || req.body.folder || 'banners';
    
    // Sanitize folder name
    if (!ALLOWED_FOLDERS.includes(folder.toLowerCase())) {
      folder = 'misc';
    }

    const targetDir = path.join(process.cwd(), 'uploads', folder.toLowerCase());

    // Auto-create subfolder if it does not exist
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

// Single File Upload Endpoint with dynamic folder support (?folder=banners)
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Determine subfolder path
  let folder = req.query.folder || req.body.folder || 'banners';
  if (!ALLOWED_FOLDERS.includes(folder.toLowerCase())) {
    folder = 'misc';
  }

  const filename = req.file.filename;
  const relativePath = `uploads/${folder.toLowerCase()}/${filename}`;
  const fileUrl = `http://localhost:5000/${relativePath}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl: fileUrl,
    filePath: `/${relativePath}`,
  });
});

export default router;
