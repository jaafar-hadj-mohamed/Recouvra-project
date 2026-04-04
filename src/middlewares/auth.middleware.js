const { verifyAccessToken } = require('../utils/jwt.utils');
const { errorResponse } = require('../utils/response.utils');
const User = require('../models/User');

/**
 * Protect routes — requires a valid JWT access token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or account deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid token.', 401);
  }
};

/**
 * Authorize roles — restrict to specific roles
 * Usage: authorize('admin') or authorize('admin', 'moderator')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
