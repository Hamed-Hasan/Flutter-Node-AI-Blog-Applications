const mongoose = require('mongoose');
const Post = require('../models/postModel');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // After successful connection, create indexes
    await Post.createIndexes();
    console.log('Indexes created for Post model');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
