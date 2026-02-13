const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/contact');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `contact-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public routes
router.post('/', upload.single('file'), submitContact);

// Admin routes (protected)
router.use(protect);

router.get('/', authorize('admin', 'super-admin'), getAllContacts);
router.get('/stats', authorize('admin', 'super-admin'), getContactStats);
router.get('/:id', authorize('admin', 'super-admin'), getContactById);
router.put('/:id/status', authorize('admin', 'super-admin'), updateContactStatus);
router.delete('/:id', authorize('super-admin'), deleteContact);

module.exports = router;