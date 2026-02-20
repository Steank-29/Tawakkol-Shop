const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require('./config/database');

// Import routes
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');
const contactRoutes = require('./routes/contact');

// Initialize app
const app = express();

// ============ PRODUCTION CORS CONFIGURATION ============
const allowedOrigins = [
  'http://localhost:5173',
  'https://tawakkol-shop.vercel.app',
  'https://tawakkol.tn',           // Add your domain
  'https://www.tawakkol.tn',        // Add www subdomain
  'http://tawakkol.tn',             // Add non-https version
  'http://www.tawakkol.tn'           // Add non-https www

].filter(Boolean); // Remove undefined values

// CORS options
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`🚫 Blocked origin: ${origin}`);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie'],
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Manual CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for allowed origins
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production')) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse JSON and URL-encoded data with increased limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// ============ CONFIGURATION ENDPOINT ============
// This helps frontend detect the correct API URL
app.get('/api/config', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${protocol}://${host}`;
  
  res.json({
    success: true,
    apiUrl: baseUrl,
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tawakkol Clothing Store API is running...',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    cors_enabled_for: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Connected',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
    cors_origins: allowedOrigins
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  
  // Handle CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Handle multer file size limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    const maxSize = err.message.includes('10MB') ? '10MB' : '5MB';
    return res.status(400).json({
      success: false,
      message: `File too large. Maximum size is ${maxSize}.`,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Handle multer file type error
  if (err.code === 'LIMIT_FILE_TYPE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only images (jpg, jpeg, png, gif, webp) are allowed.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    available_endpoints: {
      home: 'GET /',
      health: 'GET /health',
      config: 'GET /api/config',
      admin: {
        login: 'POST /api/admin/login',
        register: 'POST /api/admin/register',
        profile: 'GET /api/admin/me'
      },
      products: {
        list: 'GET /api/products',
        single: 'GET /api/products/:id'
      }
    }
  });
});

// ============ SERVER START ============
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Ensure uploads directory structure exists
    const uploadsDir = path.join(__dirname, 'uploads');
    const picturesDir = path.join(uploadsDir, 'pictures');
    const productsDir = path.join(uploadsDir, 'products');
    
    // Create directories if they don't exist
    const directories = [
      uploadsDir,
      picturesDir,
      productsDir,
      path.join(productsDir, 'sport'),
      path.join(productsDir, 'casual'),
      path.join(productsDir, 'religious'),
      path.join(productsDir, 'streetwear')
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${path.relative(__dirname, dir)}`);
      }
    });
    
    // Connect to database
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n=================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log('=================================\n');
      
      console.log('📊 CORS Configuration:');
      console.log(`   Allowed Origins: ${allowedOrigins.length} domains`);
      allowedOrigins.forEach((origin, index) => {
        console.log(`   ${index + 1}. ${origin}`);
      });
      
      console.log('\n📡 API Endpoints:');
      console.log(`   👤 Admin: http://localhost:${PORT}/api/admin`);
      console.log(`   🛍️  Products: http://localhost:${PORT}/api/products`);
      console.log(`   ❤️  Health: http://localhost:${PORT}/health`);
      console.log(`   ⚙️  Config: http://localhost:${PORT}/api/config`);
      
      console.log('\n🖼️  Static Files:');
      console.log(`   👤 Admin pictures: http://localhost:${PORT}/uploads/pictures/`);
      console.log(`   🛍️  Product images: http://localhost:${PORT}/uploads/products/`);
      
      console.log('\n☁️  Cloudinary:');
      console.log(`   Status: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Not configured'}`);
      
      console.log('\n🔐 Authentication:');
      console.log(`   JWT: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Not set'}`);
      console.log(`   Expiry: ${process.env.JWT_EXPIRE || '24h'}`);
      
      console.log('\n✅ Server ready to accept connections\n');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();