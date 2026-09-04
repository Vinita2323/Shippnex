import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'shippnex_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};
