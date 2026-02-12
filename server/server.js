const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require('./config/database');

// Import routes
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Test route - SINGLE DEFINITION (removed duplicate)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tawakkol Clothing Store API is running...',
    version: '1.0.0',
    endpoints: {
      admin: {
        register: 'POST /api/admin/register',
        login: 'POST /api/admin/login',
        profile: 'GET /api/admin/me',
        update_profile: 'PUT /api/admin/update-profile',
        upload_picture: 'PUT /api/admin/upload-picture'
      },
      products: {
        get_all: 'GET /api/products',
        get_single: 'GET /api/products/:id',
        create: 'POST /api/products (admin only)',
        update: 'PUT /api/products/:id (admin only)',
        delete: 'DELETE /api/products/:id (super-admin only)',
        toggle_status: 'PATCH /api/products/:id/status (admin only)',
        update_stock: 'PATCH /api/products/:id/stock (admin only)'
      },
      uploads: {
        admin_pictures: '/uploads/pictures/',
        product_images: '/uploads/products/',
        cloudinary_folders: {
          admins: 'tawakkol/admins',
          sport: 'tawakkol/sport',
          casual: 'tawakkol/casual',
          religious: 'tawakkol/religious',
          streetwear: 'tawakkol/streetwear'
        }
      }
    },
    limits: {
      admin_images: '5MB',
      product_images: '10MB',
      allowed_types: 'jpg, jpeg, png, gif, webp'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uploads_directory: path.join(__dirname, 'uploads'),
    database: 'Connected',
    cloudinary: 'Configured'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
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
    available_routes: {
      home: 'GET /',
      health: 'GET /health',
      admin: {
        register: 'POST /api/admin/register',
        login: 'POST /api/admin/login',
        profile: 'GET /api/admin/me',
        update_picture: 'PUT /api/admin/upload-picture'
      },
      products: {
        list: 'GET /api/products',
        single: 'GET /api/products/:id',
        create: 'POST /api/products',
        update: 'PUT /api/products/:id'
      }
    }
  });
});

// Server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Ensure uploads directory structure exists
    const fs = require('fs');
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
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}`);
      console.log(`\n📊 API Endpoints:`);
      console.log(`   👤 Admin API: http://localhost:${PORT}/api/admin`);
      console.log(`   🛍️  Products API: http://localhost:${PORT}/api/products`);
      console.log(`   ❤️  Health check: http://localhost:${PORT}/health`);
      
      console.log(`\n🖼️  Static File Access:`);
      console.log(`   👤 Admin pictures: http://localhost:${PORT}/uploads/pictures/`);
      console.log(`   🛍️  Product images: http://localhost:${PORT}/uploads/products/`);
      
      console.log(`\n☁️  Cloudinary Folders:`);
      console.log(`   👤 Admins: tawakkol/admins`);
      console.log(`   ⚽ Sport: tawakkol/sport`);
      console.log(`   👕 Casual: tawakkol/casual`);
      console.log(`   🙏 Religious: tawakkol/religious`);
      console.log(`   🏙️  Streetwear: tawakkol/streetwear`);
      
      console.log(`\n📊 Environment:`);
      console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`   MongoDB: ${process.env.MONGODB_URI ? '✓ Configured' : '✗ Not configured'}`);
      console.log(`   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Not configured'}`);
      
      console.log(`\n📏 Upload Limits:`);
      console.log(`   Admin pictures: 5MB`);
      console.log(`   Product images: 10MB`);
      console.log(`   Max files (products): 9 (1 main + 8 additional)`);
      console.log(`   Allowed types: jpg, jpeg, png, gif, webp`);
      
      console.log(`\n🔐 Authentication:`);
      console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Not set'}`);
      console.log(`   Token Expiry: ${process.env.JWT_EXPIRE || '24h'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();