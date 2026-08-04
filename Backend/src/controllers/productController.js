import Product from '../models/Product.model.js';

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
      mainImage: mainImage || '',
      homeSections: Array.isArray(homeSections) ? homeSections : [],
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
    const { category, section, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
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

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
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
    const product = await Product.findById(req.params.id);

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
