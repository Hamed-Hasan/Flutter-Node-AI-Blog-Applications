
const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { getUserDetails, registerUser, loginUser, updateUserProfile, changePassword } = require("../controllers/authController");
const { generateToken } = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

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
      },
  Mutation: {
    registerUser: async (_, { username, password, role }) => {
      return await registerUserGraphQL(username, password, role);
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
  },
};

module.exports = resolvers;
