import jwt from 'jsonwebtoken';

export const protect = (...requiredRoles) => {
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
          process.env.JWT_SECRET || 'shippnex_secret'
        );

        if (requiredRoles && requiredRoles.length > 0) {
          const roles = requiredRoles.flat().filter(Boolean);
          if (roles.length > 0) {
            const isAllowed = roles.includes(decoded.role);

            if (!isAllowed) {
              const roleStr = roles.join(' or ');
              return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to ${roleStr}`,
              });
            }
          }
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
