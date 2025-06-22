require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const path = require('path');


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Load receipt analysis router
const receiptAnalysis = require(path.join(__dirname, 'services/ai/reciptAnalysis'));
console.log("receiptAnalysis type:", typeof receiptAnalysis);
console.log("Is router?", receiptAnalysis?.use !== undefined);

// Mount receipt analysis routes
if (receiptAnalysis?.use !== undefined) {
  console.log("✅ Mounting receiptAnalysis at /api");
  app.use('/api', receiptAnalysis);
} else {
  console.error("❌ receiptAnalysis is not a valid Express router.");
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Corrected 404 handler (🔥 this was the crash source!)
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server only if not imported
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app; // For testing
