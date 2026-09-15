import Admin from '../models/Admin.model.js';
import { generateToken } from '../utils/generateToken.js';

// Super Admin Login
export const superAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find admin by email
    let admin = await Admin.findOne({ email: cleanEmail });

    // Auto-create/seed default Root Super Admin if logging in with default credentials
    if (!admin && cleanEmail === 'superadmin@shippnex.com') {
      admin = new Admin({
        name: 'Chief Financial Officer (Super Admin)',
        email: 'superadmin@shippnex.com',
        password: password || 'SuperAdmin@123',
        role: 'super_admin',
      });
      await admin.save();
      console.log('[SuperAdminAuth] Seeded default Super Admin account: superadmin@shippnex.com');
    } else if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify role - only super_admin is allowed
    if (admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Standard administrators cannot access the Super Admin Financial Panel',
      });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: 'super_admin',
    });

    res.status(200).json({
      success: true,
      message: 'Super Admin financial authentication successful',
      token,
      superAdmin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Super Admin Profile Check
export const getSuperAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin || admin.role !== 'super_admin') {
      return res.status(404).json({
        success: false,
        message: 'Super Admin profile not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      superAdmin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
