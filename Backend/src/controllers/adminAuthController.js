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
      role: admin.role,
    });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
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
