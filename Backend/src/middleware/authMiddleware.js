import jwt from 'jsonwebtoken';

export const protect = (requiredRole) => {
  return async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'shippnex_super_secret_jwt_key_2026'
        );

        if (requiredRole && decoded.role !== requiredRole) {
          return res.status(403).json({
            success: false,
            message: `Forbidden: Access restricted to ${requiredRole}`,
          });
        }

        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token failed',
        });
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }
  };
};
