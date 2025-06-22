require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('../../config/database'); // ✅ CORRECT


const app = express();

// 🧩 Monkey-patch to debug bad app.use inputs
const originalAppUse = app.use;
app.use = function (...args) {
  console.log("🧩 app.use called with:", JSON.stringify(args[0]));
  return originalAppUse.apply(app, args);
};

// ✅ Connect to MongoDB
connectDB();

// ✅ Core middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ✅ 404 handler
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error caught by middleware:", err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});


router.post('/analyze-receipt', async (req, res) => {
  res.send("Receipt analyzed");
});

module.exports = router;

// ✅ Start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
