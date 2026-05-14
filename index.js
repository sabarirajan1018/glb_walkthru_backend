require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const modelRoutes = require('./routes/modelRoutes');
const viewpointRoutes = require('./routes/viewpointRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" || 'https://glb-walkthru-frontend.vercel.app' }));
app.use(express.json());

// Serve static GLB files
app.use('/models', express.static(path.join(__dirname, 'public/models')));

// Routes
app.use('/api/models', modelRoutes);
app.use('/api/viewpoints', viewpointRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GLB Walkthrough Server Running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glb-walkthrough')
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Starting server without MongoDB...');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  });

module.exports = app;
