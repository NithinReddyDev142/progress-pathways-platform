
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Protect routes - JWT authentication
exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error during authentication',
        error: err.message
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`
      });
    }
    next();
  };
};

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
