// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://urban-pilgrim-three.vercel.app',
    'https://urban-pilgrim-sigma.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/wellness-guides', require('./routes/wellnessGuideRoutes'));
app.use('/api/wellness-guide-classes', require('./routes/wellnessGuideClassRoutes'));
app.use('/api/pilgrim-experiences', require('./routes/pilgrimRoutes'));
app.use('/api/specialties', require('./routes/specialtyRoutes'));
app.use('/api/email-verification', require('./routes/emailVerificationRoutes'));

// 🆕 NEW: Booking routes
app.use('/api/bookings', require('./routes/pilgrimBookingRoutes'));
app.use('/api/bookings', require('./routes/wellnessClassBookingRoutes'));

// 🆕 NEW: Admin routes
app.use('/api/admin/bookings', require('./routes/adminPilgrimBookingRoutes'));
app.use('/api/admin/pilgrim-experiences', require('./routes/pilgrimExperienceDiscountRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check for root
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from frontend build (if serving frontend from backend)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../UrbanPilgrimFrontend/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        success: false,
        message: 'API route not found'
      });
    }
    
    res.sendFile(path.join(__dirname, '../UrbanPilgrimFrontend/dist', 'index.html'));
  });
} else {
  // Development: Just handle API 404s
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;