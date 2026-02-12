const Admin = require('../models/admin');
const { getFileInfo } = require('../middleware/upload');

// @desc    Register a new admin WITH PICTURE
// @route   POST /api/admin/register
// @access  Public
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, contactEmail } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      // Clean up uploaded file if admin already exists
      if (req.file && req.file.path && !req.file.path.includes('cloudinary')) {
        const fs = require('fs');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      
      return res.status(400).json({
        success: false,
        message: 'Admin already exists with this email'
      });
    }

    // Get picture info if uploaded
    let pictureData = null;
    if (req.file) {
      pictureData = getFileInfo(req);
    }

    // Create admin
    const adminData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      contactEmail: contactEmail || email
    };

    // Add picture if exists
    if (pictureData) {
      adminData.picture = {
        public_id: pictureData.public_id,
        url: pictureData.url,
        storage: pictureData.storage
      };
    }

    const admin = await Admin.create(adminData);

    // Generate token
    const token = admin.generateAuthToken();

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Remove password from response
    const adminResponse = admin.getPublicProfile();

    res.status(201).json({
      success: true,
      message: pictureData 
        ? 'Admin registered successfully with profile picture' 
        : 'Admin registered successfully',
      token,
      admin: adminResponse,
      pictureInfo: pictureData ? {
        storage: pictureData.storage,
        uploaded: true
      } : null
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path && !req.file.path.includes('cloudinary')) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin and include password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = admin.generateAuthToken();

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Remove password from response
    const adminResponse = admin.getPublicProfile();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: adminResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, contactEmail } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (contactEmail) updateData.contactEmail = contactEmail;

    // Update admin
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update admin password
// @route   PUT /api/admin/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find admin with password
    const admin = await Admin.findById(req.admin.id).select('+password');

    // Check current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Generate new token
    const token = admin.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload/update profile picture
// @route   PUT /api/admin/upload-picture
// @access  Private
exports.uploadPicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a picture'
      });
    }

    const pictureData = getFileInfo(req);
    
    // Find admin
    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      // Clean up uploaded file if admin not found
      if (req.file && req.file.path && !req.file.path.includes('cloudinary')) {
        const fs = require('fs');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Delete old picture from storage if exists
    if (admin.picture && admin.picture.public_id && admin.picture.public_id !== '') {
      if (admin.picture.storage === 'cloudinary') {
        // Delete from Cloudinary
        const cloudinary = require('../config/cloudinary');
        try {
          await cloudinary.uploader.destroy(admin.picture.public_id);
          console.log(`Deleted old Cloudinary image: ${admin.picture.public_id}`);
        } catch (cloudinaryErr) {
          console.error('Error deleting old Cloudinary image:', cloudinaryErr.message);
        }
      } else if (admin.picture.storage === 'local' && admin.picture.public_id) {
        // Delete local file
        const fs = require('fs');
        const path = require('path');
        const localPath = path.join(__dirname, '..', 'uploads', 'pictures', admin.picture.public_id);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
          console.log(`Deleted local image: ${admin.picture.public_id}`);
        }
      }
    }

    // Update admin picture
    admin.picture = {
      public_id: pictureData.public_id,
      url: pictureData.url,
      storage: pictureData.storage
    };
    
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      admin: admin.getPublicProfile(),
      pictureInfo: {
        storage: pictureData.storage,
        uploaded: true
      }
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path && !req.file.path.includes('cloudinary')) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout admin (client-side token removal)
// @route   POST /api/admin/logout
// @access  Private
exports.logoutAdmin = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all admins (super-admin only)
// @route   GET /api/admin/all
// @access  Private/Super-Admin
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin by ID
// @route   GET /api/admin/:id
// @access  Private/Super-Admin
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete admin (super-admin only)
// @route   DELETE /api/admin/:id
// @access  Private/Super-Admin
exports.deleteAdmin = async (req, res) => {
  try {
    // Don't allow self-deletion
    if (req.params.id === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Delete profile picture from storage if exists
    if (admin.picture && admin.picture.public_id && admin.picture.public_id !== '') {
      if (admin.picture.storage === 'cloudinary') {
        // Delete from Cloudinary
        const cloudinary = require('../config/cloudinary');
        try {
          await cloudinary.uploader.destroy(admin.picture.public_id);
          console.log(`Deleted Cloudinary image for deleted admin: ${admin.picture.public_id}`);
        } catch (cloudinaryErr) {
          console.error('Error deleting Cloudinary image:', cloudinaryErr.message);
        }
      } else if (admin.picture.storage === 'local' && admin.picture.public_id) {
        // Delete local file
        const fs = require('fs');
        const path = require('path');
        const localPath = path.join(__dirname, '..', 'uploads', 'pictures', admin.picture.public_id);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
          console.log(`Deleted local image for deleted admin: ${admin.picture.public_id}`);
        }
      }
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};