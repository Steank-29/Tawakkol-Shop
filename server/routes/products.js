const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateStock
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/productUpload');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  authorize('admin', 'super-admin'),
  uploadProductImages,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'super-admin'),
  uploadProductImages,
  updateProduct
);

router.patch(
  '/:id/status',
  protect,
  authorize('admin', 'super-admin'),
  toggleProductStatus
);

router.patch(
  '/:id/stock',
  protect,
  authorize('admin', 'super-admin'),
  updateStock
);

// Super-admin only routes
router.delete(
  '/:id',
  protect,
  authorize('admin','super-admin'),
  deleteProduct
);

module.exports = router;