const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// Helper function to generate safe filename
const generateSafeName = (req) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  
  // Get product name from request body
  const productName = req.body && req.body.name 
    ? req.body.name.trim()
    : 'product';
  
  // Sanitize the name: remove special chars, replace spaces with hyphens
  const sanitizedName = productName
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '')  // Remove special characters
    .toLowerCase()                   // Convert to lowercase
    .substring(0, 50);               // Limit to 50 chars to avoid Cloudinary limits
  
  return `${sanitizedName}-${uniqueSuffix}`;
};

// Configure multer for local storage (backup)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.category || 'products';
    const dir = `uploads/products/${folder}`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const safeName = generateSafeName(req);
    const extension = path.extname(file.originalname);
    cb(null, `${safeName}${extension}`);
  }
});

// Configure Cloudinary storage for products
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Get category from request body
    const category = req.body.category ? req.body.category.toLowerCase() : 'products';
    const folder = `tawakkol/${category}`;
    
    // Generate safe public_id
    const public_id = generateSafeName(req);
    
    console.log(`📤 Uploading to Cloudinary - Folder: ${folder}, Public ID: ${public_id}`);
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      public_id: public_id  // Use the generated string, not a function
    };
  },
});

// Create upload instances
const uploadToCloudinary = multer({ 
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 9 // Max 9 files (1 main + 8 additional)
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid image type. Allowed: JPEG, PNG, GIF, WebP'), false);
    }
    
    cb(null, true);
  }
});

const uploadToLocal = multer({ 
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 9 // Max 9 files
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid image type. Allowed: JPEG, PNG, GIF, WebP'), false);
    }
    
    cb(null, true);
  }
});

// Main upload middleware for products
exports.uploadProductImages = (req, res, next) => {
  // Try Cloudinary first
  const upload = uploadToCloudinary.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 8 }
  ]);
  
  upload(req, res, function(err) {
    if (err) {
      console.log('❌ Cloudinary upload failed:', err.message);
      console.log('🔄 Falling back to local storage...');
      
      // Fallback to local storage
      const localUpload = uploadToLocal.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'additionalImages', maxCount: 8 }
      ]);
      
      localUpload(req, res, function(localErr) {
        if (localErr) {
          return res.status(400).json({
            success: false,
            message: localErr.message
          });
        }
        console.log('✅ Images saved locally successfully');
        next();
      });
    } else {
      console.log('✅ Images uploaded to Cloudinary successfully');
      next();
    }
  });
};

// Get file info for response
exports.getFileInfo = (req) => {
  const fileInfo = {
    mainImage: null,
    additionalImages: []
  };

  // Process main image
  if (req.files && req.files.mainImage && req.files.mainImage[0]) {
    const file = req.files.mainImage[0];
    
    if (file.path && file.path.includes('cloudinary')) {
      // Cloudinary file
      fileInfo.mainImage = {
        public_id: file.filename,
        url: file.path,
        storage: 'cloudinary'
      };
      console.log('📁 Main image stored in Cloudinary:', file.filename);
    } else {
      // Local file
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/${file.path.replace(/\\/g, '/')}`;
      
      fileInfo.mainImage = {
        public_id: file.filename,
        url: fileUrl,
        storage: 'local',
        localPath: file.path
      };
      console.log('📁 Main image stored locally:', file.filename);
    }
  }

  // Process additional images
  if (req.files && req.files.additionalImages) {
    console.log(`📁 Processing ${req.files.additionalImages.length} additional images`);
    
    req.files.additionalImages.forEach((file, index) => {
      if (file.path && file.path.includes('cloudinary')) {
        // Cloudinary file
        fileInfo.additionalImages.push({
          public_id: file.filename,
          url: file.path,
          storage: 'cloudinary'
        });
        console.log(`  ➕ Additional image ${index + 1}: Cloudinary`);
      } else {
        // Local file
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/${file.path.replace(/\\/g, '/')}`;
        
        fileInfo.additionalImages.push({
          public_id: file.filename,
          url: fileUrl,
          storage: 'local',
          localPath: file.path
        });
        console.log(`  ➕ Additional image ${index + 1}: Local`);
      }
    });
  }

  return fileInfo;
};

// Cleanup uploaded files on error
exports.cleanupFiles = (fileInfo) => {
  console.log('🧹 Cleaning up files...');
  
  if (fileInfo.mainImage && fileInfo.mainImage.storage === 'local' && fileInfo.mainImage.localPath) {
    if (fs.existsSync(fileInfo.mainImage.localPath)) {
      fs.unlinkSync(fileInfo.mainImage.localPath);
      console.log('🗑️  Deleted main image:', fileInfo.mainImage.localPath);
    }
  }
  
  fileInfo.additionalImages.forEach((img, index) => {
    if (img.storage === 'local' && img.localPath) {
      if (fs.existsSync(img.localPath)) {
        fs.unlinkSync(img.localPath);
        console.log(`🗑️  Deleted additional image ${index + 1}:`, img.localPath);
      }
    }
  });
};

// Delete files from storage
exports.deleteFilesFromStorage = async (images) => {
  console.log(`🗑️  Deleting ${images.length} images from storage...`);
  
  for (const image of images) {
    if (image && image.public_id) {
      if (image.storage === 'cloudinary') {
        try {
          await cloudinary.uploader.destroy(image.public_id);
          console.log(`✅ Deleted Cloudinary image: ${image.public_id}`);
        } catch (err) {
          console.error('❌ Error deleting Cloudinary image:', err.message);
        }
      } else if (image.storage === 'local' && image.public_id) {
        // Try to find and delete the local file
        const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
        
        // Search for the file in all category folders
        const categories = ['sport', 'casual', 'religious', 'streetwear', 'products'];
        
        for (const category of categories) {
          const categoryDir = path.join(uploadsDir, category);
          if (fs.existsSync(categoryDir)) {
            const files = fs.readdirSync(categoryDir);
            for (const file of files) {
              if (file.includes(image.public_id)) {
                const filePath = path.join(categoryDir, file);
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                  console.log(`✅ Deleted local image: ${filePath}`);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
};