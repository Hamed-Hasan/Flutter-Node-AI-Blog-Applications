const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const typeDefs = require('../GraphQL/schema');
const resolvers = require('../GraphQL/resolvers');

const setupApolloServer = () => {
  // Initialize ApolloServer
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let contextObj = { user: null };

      try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
          const token = authHeader.split('Bearer ')[1];
          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            contextObj.user = await User.findById(decoded.id).exec();
          }
        }
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          console.error('Token has expired', error);
          console.log(`Token expired at ${error.expiredAt.toISOString()}`);
          throw new AuthenticationError('Session has expired. Please log in again.');
        } else {
          console.error('Error in authentication:', error);
          throw new AuthenticationError('Invalid or expired token');
        }
      }

      return contextObj;
    }
  });

  return apolloServer;
};

module.exports = setupApolloServer;