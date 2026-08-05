import Category from '../models/Category.model.js';

// Initial default categories seed
const initialCategories = [
  { name: 'Grains & Flours', icon: 'Wheat', image: '/uploads/categories/grains-removebg-preview.png', priority: 1, status: 'Active' },
  { name: 'Oil & Ghee', icon: 'Droplet', image: '/uploads/categories/OilGhee-removebg-preview.png', priority: 2, status: 'Active' },
  { name: 'Spices & Masala', icon: 'Flame', image: '/uploads/categories/masala-removebg-preview.png', priority: 3, status: 'Active' },
  { name: 'Sugar & Sweeteners', icon: 'Coffee', image: '/uploads/categories/Sugar-removebg-preview.png', priority: 4, status: 'Active' },
  { name: 'Grocery Essentials', icon: 'ShoppingBag', image: '/uploads/categories/Grocery-removebg-preview.png', priority: 5, status: 'Active' },
  { name: 'Ready-to-Cook', icon: 'Utensils', image: '/uploads/categories/readyfoot-removebg-preview.png', priority: 6, status: 'Active' },
  { name: 'Home Care', icon: 'Sparkles', image: '/uploads/categories/homecare-removebg-preview.png', priority: 7, status: 'Active' },
  { name: 'Personal Care', icon: 'Heart', image: '/uploads/categories/personalcare-removebg-preview.png', priority: 8, status: 'Active' },
];

// Get all categories (Public)
export const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ priority: 1 });

    // Seed default categories if database is empty
    if (categories.length === 0) {
      categories = await Category.insertMany(initialCategories);
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Create new category (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, image, status, priority, parent } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const categoryExists = await Category.findOne({ name: name.trim() });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      icon: icon || 'Package',
      image: image || '/uploads/categories/default.png',
      status: status || 'Active',
      priority: priority || 1,
      parent: parent || null,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Update category (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
