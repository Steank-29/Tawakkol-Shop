// backend/routes/relProductRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRelProduct,
  getRelProducts,
  getRelProduct,
  updateRelProduct,
  deleteRelProduct,
  toggleRelProductStatus,
  updateRelProductStock
} = require('../controllers/relProductController');

const { protect, authorize } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/productUpload');

// Public routes
router.get('/', getRelProducts);
router.get('/:id', getRelProduct);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  authorize('admin', 'super-admin'),
  uploadProductImages,
  createRelProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'super-admin'),
  uploadProductImages,
  updateRelProduct
);

router.patch(
  '/:id/status',
  protect,
  authorize('admin', 'super-admin'),
  toggleRelProductStatus
);

router.patch(
  '/:id/stock',
  protect,
  authorize('admin', 'super-admin'),
  updateRelProductStock
);

// Super-admin only routes
router.delete(
  '/:id',
  protect,
  authorize('admin', 'super-admin'),
  deleteRelProduct
);

module.exports = router;