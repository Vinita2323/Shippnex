import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Groceries'
    },
    subCategory: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: ''
    },
    unitValue: {
      type: String,
      default: '1'
    },
    unitType: {
      type: String,
      default: 'kg'
    },
    unit: {
      type: String,
      default: '1 kg'
    },
    seller: {
      type: String,
      default: 'ShippNex Official Store'
    },
    description: {
      type: String,
      default: ''
    },
    mrp: {
      type: Number,
      required: [true, 'MRP price is required'],
      min: 0
    },
    salePrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: 0
    },
    taxRate: {
      type: String,
      default: '5%'
    },
    hsnCode: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      default: 0
    },
    minStockLimit: {
      type: Number,
      default: 10
    },
    sku: {
      type: String,
      default: ''
    },
    mainImage: {
      type: String,
      default: ''
    },
    homeSections: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Pending Audit'],
      default: 'Published'
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
