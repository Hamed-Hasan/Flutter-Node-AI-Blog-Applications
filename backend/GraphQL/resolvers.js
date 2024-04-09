
const { getUserDetails, registerUser, loginUser, updateUserProfile, changePassword } = require("../controllers/authController");
const User = require("../models/userModel");

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
    registerUser: async (_, args) => {
      return await registerUser(args);
    },
    loginUser: async (_, args) => {
      return await loginUser(args);
    },
    updateUserProfile: async (_, args, { user }) => {
      return await updateUserProfile(user._id, args);
    },
    changePassword: async (_, args, { user }) => {
      return await changePassword(user._id, args);
    },
  },
};

module.exports = resolvers;
