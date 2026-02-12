const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure multer for local storage (backup)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pictures/'); // Local folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, 'admin-' + uniqueSuffix + '.' + extension);
  }
});

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tawakkol/admins', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return 'admin-' + uniqueSuffix;
    }
  },
});

// Create multer upload instances
const uploadToCloudinary = multer({ 
  storage: cloudinaryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const uploadToLocal = multer({ 
  storage: localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Main upload middleware
exports.uploadAdminPicture = (req, res, next) => {
  // Try Cloudinary first, fallback to local
  const upload = uploadToCloudinary.single('picture');
  
  upload(req, res, function(err) {
    if (err) {
      console.log('Cloudinary upload failed, trying local:', err.message);
      
      // Fallback to local storage
      const localUpload = uploadToLocal.single('picture');
      localUpload(req, res, function(localErr) {
        if (localErr) {
          return res.status(400).json({
            success: false,
            message: localErr.message
          });
        }
        next();
      });
    } else {
      next();
    }
  });
};

// Get file info for response
exports.getFileInfo = (req) => {
  if (!req.file) return null;

  // Check if file is from Cloudinary or local
  if (req.file.path && req.file.path.includes('cloudinary')) {
    // Cloudinary file
    return {
      public_id: req.file.filename,
      url: req.file.path,
      storage: 'cloudinary'
    };
  } else {
    // Local file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
    
    return {
      public_id: req.file.filename,
      url: fileUrl,
      storage: 'local',
      localPath: req.file.path
    };
  }
};