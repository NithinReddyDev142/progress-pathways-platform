
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Environment variables with defaults
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

// Middleware
app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server running', environment: NODE_ENV });
});

// API Routes - you would import and use your route files here
// app.use('/api/users', require('./routes/users'));
// app.use('/api/courses', require('./routes/courses'));

// Serve static assets in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
