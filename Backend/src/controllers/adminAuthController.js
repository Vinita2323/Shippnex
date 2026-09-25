import Admin from '../models/Admin.model.js';
import { generateToken } from '../utils/generateToken.js';

// Admin Login with Email & Password
export const adminLogin = async (req, res, next) => {
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

    // Auto-create/seed default root admin if logging in with default credentials
    if (!admin && cleanEmail === 'admin@shippnex.com') {
      admin = new Admin({
        name: 'Root Administrator',
        email: 'admin@shippnex.com',
        password: password || 'admin123',
        role: 'admin',
      });
      await admin.save();
    } else if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    let isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      // If root admin is logging in with default standard password, reset and authenticate
      if (cleanEmail === 'admin@shippnex.com' && (password === 'admin123' || password === 'Admin@123' || password === 'admin@123')) {
        admin.password = password;
        await admin.save();
        isMatch = true;
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    const nameParts = (admin.name || '').split(' ');
    const firstName = admin.firstName || nameParts[0] || '';
    const lastName = admin.lastName || nameParts.slice(1).join(' ') || '';

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        _id: admin._id,
        name: admin.name || `${firstName} ${lastName}`.trim() || 'Administrator',
        firstName: firstName,
        lastName: lastName,
        email: admin.email,
        mobile: admin.mobile || '',
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user?.id || req.user?._id;
    let admin = null;

    if (adminId) {
      admin = await Admin.findById(adminId).select('-password');
    }

    // Fallback if token user not found or for root admin
    if (!admin) {
      admin = await Admin.findOne({ role: { $in: ['admin', 'super_admin'] } }).select('-password');
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found',
      });
    }

    const nameParts = (admin.name || '').split(' ');
    const firstName = admin.firstName || nameParts[0] || '';
    const lastName = admin.lastName || nameParts.slice(1).join(' ') || '';

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        _id: admin._id,
        name: admin.name || `${firstName} ${lastName}`.trim() || 'Administrator',
        firstName: firstName,
        lastName: lastName,
        email: admin.email,
        mobile: admin.mobile || '',
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user?.id || req.user?._id;
    let admin = null;

    if (adminId) {
      admin = await Admin.findById(adminId);
    }

    if (!admin) {
      admin = await Admin.findOne({ role: { $in: ['admin', 'super_admin'] } });
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found',
      });
    }

    const { firstName, lastName, name, email, mobile, password, newPassword } = req.body;

    if (firstName !== undefined) admin.firstName = String(firstName).trim();
    if (lastName !== undefined) admin.lastName = String(lastName).trim();

    if (name !== undefined && name.trim()) {
      admin.name = name.trim();
    } else if (firstName !== undefined || lastName !== undefined) {
      admin.name = `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Administrator';
    }

    if (mobile !== undefined) {
      admin.mobile = String(mobile).trim();
    }

    if (email && email.trim()) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail !== admin.email) {
        const existing = await Admin.findOne({ email: cleanEmail, _id: { $ne: admin._id } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'An admin account with this email already exists',
          });
        }
        admin.email = cleanEmail;
      }
    }

    const pwdToSet = newPassword || password;
    if (pwdToSet && typeof pwdToSet === 'string' && pwdToSet.trim().length >= 4) {
      admin.password = pwdToSet.trim();
    }

    await admin.save();

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    const nameParts = (admin.name || '').split(' ');
    const finalFirstName = admin.firstName || nameParts[0] || '';
    const finalLastName = admin.lastName || nameParts.slice(1).join(' ') || '';

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      token,
      admin: {
        id: admin._id,
        _id: admin._id,
        name: admin.name || `${finalFirstName} ${finalLastName}`.trim() || 'Administrator',
        firstName: finalFirstName,
        lastName: finalLastName,
        email: admin.email,
        mobile: admin.mobile || '',
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

