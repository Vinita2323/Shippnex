import mongoose from 'mongoose';
import Product from '../models/Product.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

const processImage = async (imgStr, folder = 'products') => {
  if (!imgStr) return '';
  dotenv.config();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const isCloudinaryConfigured = Boolean(cloudName && cloudName !== 'your_cloud_name_here');

  if (isCloudinaryConfigured && typeof imgStr === 'string' && imgStr.startsWith('data:image/')) {
    try {
      const res = await uploadToCloudinary(imgStr, folder);
      return res.secure_url;
    } catch (err) {
      console.warn('Cloudinary auto-upload failed, using fallback:', err.message);
    }
  }
  return imgStr;
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      brand,
      unitValue,
      unitType,
      seller,
      description,
      mrp,
      salePrice,
      taxRate,
      hsnCode,
      stock,
      minStockLimit,
      sku,
      mainImage,
      homeSections,
      galleryImages,
      status,
      isFeatured
    } = req.body;

    if (!name || !mrp || salePrice === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, MRP, Sale Price, Stock)'
      });
    }

    const formattedUnit = `${unitValue || '1'} ${unitType || 'kg'}`;

    // Process mainImage & galleryImages through Cloudinary if configured
    const processedMainImage = await processImage(mainImage, 'products/main');
    let processedGalleryImages = [];
    if (Array.isArray(galleryImages)) {
      processedGalleryImages = await Promise.all(galleryImages.map(img => processImage(img, 'products/gallery')));
    }

    const product = await Product.create({
      name,
      category: category || 'Groceries',
      subCategory: subCategory || '',
      brand: brand || '',
      unitValue: unitValue || '1',
      unitType: unitType || 'kg',
      unit: formattedUnit,
      seller: seller || 'ShippNex Official Store',
      description: description || '',
      mrp: Number(mrp),
      salePrice: Number(salePrice),
      taxRate: taxRate || '5%',
      hsnCode: hsnCode || '',
      stock: Number(stock),
      minStockLimit: minStockLimit ? Number(minStockLimit) : 10,
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      mainImage: processedMainImage || '',
      homeSections: Array.isArray(homeSections) ? homeSections : [],
      galleryImages: processedGalleryImages,
      status: status || 'Published',
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, section, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (section) {
      query.homeSections = section;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products'
    });
  }
};

// Helper to find product by ObjectId or SKU
const findProductByIdOrSku = async (idOrSku) => {
  if (!idOrSku) return null;
  if (mongoose.Types.ObjectId.isValid(idOrSku)) {
    const p = await Product.findById(idOrSku);
    if (p) return p;
  }
  return await Product.findOne({ sku: idOrSku });
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await findProductByIdOrSku(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product details'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await findProductByIdOrSku(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData.mainImage) {
      updateData.mainImage = await processImage(updateData.mainImage, 'products/main');
    }
    if (Array.isArray(updateData.galleryImages)) {
      updateData.galleryImages = await Promise.all(updateData.galleryImages.map(img => processImage(img, 'products/gallery')));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await findProductByIdOrSku(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product'
    });
  }
};
