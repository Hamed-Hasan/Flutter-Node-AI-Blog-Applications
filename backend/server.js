const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const authRoutes = require('./routes/authRoutes');

const typeDefs = require('./GraphQL/schema');
const resolvers = require('./GraphQL/resolvers');
const User = require('./models/userModel');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Set up Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const contextObj = {};
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split('Bearer ')[1]; // Ensure this split matches exactly
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id).exec(); // Added .exec() for Mongoose execution
          contextObj.user = user;
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      }
    }
  
    return contextObj;
  },
});

// Apply Apollo Middleware to the Express app
apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql' });
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define REST API routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
