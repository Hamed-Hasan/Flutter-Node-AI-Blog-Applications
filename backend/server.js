const express = require('express');
const connectDB = require('./config/db');
const setupApolloServer = require('./middleware/apollo');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Apollo Server as middleware
const apolloServer = setupApolloServer();

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