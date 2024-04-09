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



// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, bio, profilePicture, socialLinks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    user.socialLinks = socialLinks || user.socialLinks;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      socialLinks: updatedUser.socialLinks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during profile update' });
  }
};


module.exports = { 
  registerUser, 
  loginUser,
  updateUserProfile,
};
