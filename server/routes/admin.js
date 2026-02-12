const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getMe,
  updateProfile,
  updatePassword,
  uploadPicture,
  logoutAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');
const { uploadAdminPicture } = require('../middleware/upload'); // Import upload middleware

// Public routes
router.post('/register', uploadAdminPicture, registerAdmin); // Added upload middleware
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.put('/upload-picture', protect, uploadAdminPicture, uploadPicture); // Added upload middleware before controller
router.post('/logout', protect, logoutAdmin);

// Super-admin only routes
router.get('/all', protect, authorize('super-admin'), getAllAdmins);
router.get('/:id', protect, authorize('super-admin'), getAdminById);
router.delete('/:id', protect, authorize('super-admin'), deleteAdmin);

module.exports = router;