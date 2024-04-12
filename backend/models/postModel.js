const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true, // Add an index for individual field
  },
  body: {
    type: String,
    required: true,
    index: true, // Add an index for individual field
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  dislikes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, { timestamps: true });

// Create a compound text index on title and body
postSchema.index({ title: 'text', body: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
