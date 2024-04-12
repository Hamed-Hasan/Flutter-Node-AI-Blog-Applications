
const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { getUserDetails, registerUser, loginUser, updateUserProfile, changePassword } = require("../controllers/authController");
const { generateToken } = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const Post = require('../models/postModel');
const { formatDate } = require('../utils/formatDate');
const Comment = require('../models/commentModel');



// Example authenticateLogin function
const authenticateLogin = async (username, password) => {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      throw new Error('User not found');
    }
  
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
  
    return user; // This should be the user object
  };
// This function now returns a user or throws an error instead of manipulating the response directly
const registerUserGraphQL = async (username, password, role) => {
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: token,
    };
  } catch (error) {
    throw new Error('Server error during registration: ' + error.message);
  }
};


const updateUserProfileGraphQL = async (userId, args) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (args.username) {
      const existingUser = await User.findOne({ username: args.username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        throw new Error('Username already taken');
      }
      user.username = args.username;
    }

    user.bio = args.bio || user.bio;
    user.profilePicture = args.profilePicture || user.profilePicture;
    user.socialLinks = args.socialLinks || user.socialLinks;

    const updatedUser = await user.save();

    return updatedUser;
  } catch (error) {
    throw new Error('Server error during profile update: ' + error.message);
  }
};

// This function should not take req or res as parameters in a GraphQL context
const changePasswordGraphQL = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // You can decide what to return here, for example, a success message
    return 'Password changed successfully';
  } catch (error) {
    // Rethrow the error for the GraphQL server to catch
    throw new Error(error.message);
  }
};


const resolvers = {
    Query: {
        getUserDetails: async (_, __, { user }) => {
          if (!user) {
            throw new Error('Authentication required'); // Ensures the user is authenticated
          }
          try {
            const userDetails = await User.findById(user._id); // Assuming user object has _id
            if (!userDetails) {
              throw new Error('User not found');
            }
            return userDetails; // User object to return
          } catch (error) {
            console.error('Error fetching user details:', error);
            throw new Error('Error fetching user details');
          }
        },

        getPosts: async () => {
          // Find all posts and populate the author field
          let posts = await Post.find().populate('author');
          
          // Map over the posts to populate likes and dislikes while ensuring uniqueness
          posts = await Promise.all(posts.map(async (post) => {
            // Ensure uniqueness
            const uniqueLikes = [...new Set(post.likes.map(id => id.toString()))];
            const uniqueDislikes = [...new Set(post.dislikes.map(id => id.toString()))];
            
            // Safely populate likes and dislikes
            const populatedLikes = await User.find({ '_id': { $in: uniqueLikes } }, '_id username');
            const populatedDislikes = await User.find({ '_id': { $in: uniqueDislikes } }, '_id username');
            
            // Construct the final post object
            return {
              ...post.toObject(),
              likes: populatedLikes,
              dislikes: populatedDislikes,
              createdAt: formatDate(post.createdAt),
              updatedAt: formatDate(post.updatedAt)
            };
          }));
        
          // Filter out posts with empty likes and dislikes arrays
          posts = posts.filter(post => post.likes.length > 0 || post.dislikes.length > 0);
        
          // Log the final posts with populated fields
          // console.log('Final posts with populated fields:', JSON.stringify(posts, null, 2));
          return posts;
        },
        
        
        
        getPost: async (_, { _id }) => {
          let post = await Post.findById(_id);
          if (!post) {
            throw new Error('Post not found');
          }
        
          // Populate author
          post = await post.populate('author');
        
          // Safely populate likes and dislikes
          const populatedLikes = await User.find({
            '_id': { $in: post.likes }
          }, '_id username');
        
          const populatedDislikes = await User.find({
            '_id': { $in: post.dislikes }
          }, '_id username');
        
          // Return the post with populated likes and dislikes, ensuring they are not null
          return {
            ...post.toObject(),
            likes: populatedLikes,
            dislikes: populatedDislikes,
            createdAt: formatDate(post.createdAt),
            updatedAt: formatDate(post.updatedAt)
          };
        },
        
        getUserPosts: async (_, { authorId }) => {
          return await Post.find({ author: authorId }).populate('author');
        },

          // Get comments for a specific post
    getComments: async (_, { postId }) => {
      const comments = await Comment.find({ post: postId }).populate('author');
      return comments;
    },
      },
  Mutation: {
    registerUser: async (_, { username, password, role }) => {
      // Your registerUserGraphQL implementation
      const user = await registerUserGraphQL(username, password, role);
      return {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: user.token, // Include the token in the response
      };
    },
   loginUser: async (_, { username, password }) => {
      try {
        // Use the authenticateLogin function here
        const user = await authenticateLogin(username, password);
        const token = generateToken(user); // Use your token generation logic

        return {
          _id: user._id,
          username: user.username,
          role: user.role,
          token: token, // Include the token in the GraphQL response
        };
      } catch (error) {
        throw new Error('Error logging in: ' + error.message);
      }
    },
    updateUserProfile: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in to do this');
      
      const updatedUser = await updateUserProfileGraphQL(user._id, args);
      
      return {
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        socialLinks: updatedUser.socialLinks,
      };
    },
    changePassword: async (_, { oldPassword, newPassword }, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in to do this');

      const result = await changePasswordGraphQL(user._id, oldPassword, newPassword);
      
      // The result here depends on what the changePasswordGraphQL function returns
      return result;
    },


    createPost: async (_, { title, body }, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in to create a post');
    
      // Assuming that `user` object contains the logged-in user's details including `_id`
      const post = await Post.create({ title, body, author: user._id });
    
      return post.populate('author')// This will return the post with the author information populated
    },
    
    
    updatePost: async (_, { _id, title, body }, { user }) => {
      // console.log("🚀 ~ updatePost: ~ _id:", _id);
      // console.log("🚀 ~ updatePost: ~ user:", user);
    
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
    
      const post = await Post.findById(_id);
    
      if (!post) {
        throw new Error('Post not found');
      }
    
      if (post.author.toString() !== user._id.toString()) {
        throw new AuthenticationError('You do not have permission to update this post');
      }
    
      const updatedPost = await Post.findByIdAndUpdate(_id, { title, body }, { new: true }).populate('author');
    
      if (!updatedPost.author.username) {
        throw new Error('Author username cannot be null');
      }
    
      return updatedPost;
    },
    
    deletePost: async (_, { _id }, { user, isAuthorized }) => {
      // isAuthorized(['author', 'admin']); // Ensure the user has one of the specified roles

      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const post = await Post.findById(_id);

      // Similarly, check if the user is the author or has admin privileges
      if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new AuthenticationError('You do not have permission to delete this post');
      }

      await Post.findByIdAndDelete(_id);
      return 'Post deleted successfully';
    },
    likePost: async (_, { _id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to like a post');
      }
    
      let post = await Post.findById(_id);
      if (!post) {
        throw new Error('Post not found');
      }
    
      const hasLiked = post.likes.some(likeUserId => likeUserId.toString() === user._id.toString());
    
      if (!hasLiked) {
        post.likes.push(user._id);
        await post.save();
      }
    
      // Populate likes with a catch for any null references that might exist
      post = await Post.findById(_id).populate({
        path: 'likes',
        match: { username: { $exists: true } },
        select: '_id username'
      });
    
      // If the post has already been liked by the user, return the message
      if (hasLiked) {
        return {
          ...post.toObject(),
          message: 'User has already liked the post'
        };
      }
    
      return post;
    },
    
    
    
    dislikePost: async (_, { _id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to dislike a post');
      }
    
      let post = await Post.findById(_id);
      if (!post) {
        throw new Error('Post not found');
      }
    
      const hasDisliked = post.dislikes.some(dislikeUserId => dislikeUserId.toString() === user._id.toString());
    
      if (!hasDisliked) {
        post.dislikes.push(user._id);
        await post.save();
      }
    
      // Populate dislikes with a catch for any null references that might exist
      post = await Post.findById(_id).populate({
        path: 'dislikes',
        match: { username: { $exists: true } },
        select: '_id username'
      });
    
      // If the post has already been disliked by the user, return the message
      if (hasDisliked) {
        return {
          ...post.toObject(),
          message: 'User has already disliked the post'
        };
      }
    
      return post;
    },
    
    // Create a new comment
    createComment: async (_, { postId, content }, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in to create a comment');
    
      // Check if the post exists
      const postExists = await Post.exists({ _id: postId });
      if (!postExists) throw new Error('Post not found');
    
      const comment = await new Comment({
        content,
        author: user._id,
        post: postId,
      }).save();
    
      // Properly populate the 'post' field after saving the comment
      await comment.populate('post');
      await comment.populate('author');
      return comment;
    },
    
    

    // Update an existing comment
    updateComment: async (_, { commentId, content }, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in to update a comment');

      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error('Comment not found');

      if (comment.author.toString() !== user._id.toString()) {
        throw new AuthenticationError('You do not have permission to update this comment');
      }

      comment.content = content;
      await comment.save();

      return comment.populate('author');
    },

    // Delete an existing comment
    deleteComment: async (_, { commentId }, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in to delete a comment');
    
      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error('Comment not found');
    
      if (comment.author.toString() !== user._id.toString()) {
        throw new AuthenticationError('You do not have permission to delete this comment');
      }
    
      await Comment.findByIdAndDelete(commentId); // Use findByIdAndDelete instead of remove
      return 'Comment deleted successfully';
    },
    

   // Like a comment
   likeComment: async (_, { commentId }, { user }) => {
    try {
      console.log('Starting likeComment resolver');
      console.log('CommentId:', commentId);
  
      // Find the comment by ID
      let comment = await Comment.findById(commentId);
  
      console.log('Comment found:', comment);
  
      if (!comment) {
        throw new Error('Comment not found');
      }
  
      // Populate the author field of the comment
      await comment.populate('author');
  
      console.log('Comment after population:', comment);
  
      // Check if the user has already liked the comment
      if (comment.likes.some(like => like.toString() === user.id)) {
        throw new Error('User has already liked the comment');
      }
  
      // Add the user's ID to the likes array
      comment.likes.push(user.id);
  
      // Save the updated comment
      await comment.save();
  
      // Populate the likes array with user objects
      await comment.populate('likes')
  
      console.log('Comment liked successfully');
  
      // Set the success message
      const message = 'Comment liked successfully';
  
      return { ...comment.toObject(), message };
    } catch (error) {
      console.error('Error in likeComment resolver:', error);
      throw error;
    }
  },
  
  
  
// Dislike a comment
dislikeComment: async (_, { commentId }, { user }) => {
  try {
    if (!user) throw new AuthenticationError('You must be logged in to dislike a comment');

    console.log('Starting dislikeComment resolver');
    console.log('CommentId:', commentId);

    let comment = await Comment.findById(commentId);
    if (!comment) throw new Error('Comment not found');

    // Check if the user has already disliked the comment
    const hasDisliked = comment.dislikes.some(dislikeUserId => dislikeUserId.toString() === user._id.toString());

    if (!hasDisliked) {
      comment.dislikes.push(user._id);
      await comment.save();
    }

    // Populate dislikes with a catch for any null references that might exist
    comment = await Comment.findById(commentId)
      .populate({
        path: 'dislikes',
        match: { username: { $exists: true } },
        select: '_id username'
      })
      .populate('author'); // Populate the author field

    // If the comment has already been disliked by the user, return the message
    if (hasDisliked) {
      return {
        ...comment.toObject(),
        message: 'User has already disliked the comment'
      };
    }

    console.log('Comment disliked successfully');

    // Set the success message
    const message = 'Comment disliked successfully';

    return { ...comment.toObject(), message };
  } catch (error) {
    console.error('Error in dislikeComment resolver:', error);
    throw error;
  }
},



  },
};

module.exports = resolvers;
