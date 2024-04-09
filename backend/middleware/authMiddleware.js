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
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = { authenticate, roleAuth, generateToken };
