const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');



// Registration logic
const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    
    // Create a new user
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    // Return the user and JWT token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login logic
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return the user and JWT token
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };
