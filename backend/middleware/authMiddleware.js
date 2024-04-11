const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const roleAuth = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

// Middleware to authenticate users based on JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split('Bearer ')[1];
      if (token) {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).exec();
        if (user) {
          req.user = user;
          req.isAuthorized = (roles) => {
            if (!roles.includes(user.role)) {
              throw new AuthenticationError('Forbidden: Insufficient permissions');
            }
          };
          next();
        } else {
          throw new AuthenticationError('Invalid or expired token');
        }
      } else {
        throw new AuthenticationError('No token provided');
      }
    } else {
      throw new AuthenticationError('No authorization header found');
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token has expired', error);
      console.log(`Token expired at ${error.expiredAt.toISOString()}`);
      throw new AuthenticationError('Session has expired. Please log in again.');
    } else {
      console.error('Error in authentication:', error);
      throw error;
    }
  }
};

// Function to generate JWT
const generateToken = (user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  console.log(`Token generated for user ${user._id} with expiration in 7 days`);
  return token;
};


module.exports = { authenticate, roleAuth, generateToken };
