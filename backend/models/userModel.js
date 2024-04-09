const mongoose = require('mongoose');
const userRoles = ['reader', 'author', 'admin'];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: userRoles,
    default: 'reader',
  },

  bio: {
    type: String,
    trim: true,
  },

  profilePicture: {
    type: String, // URL to the image
  },
  
  socialLinks: {
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
