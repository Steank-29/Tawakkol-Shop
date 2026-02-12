// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:id', orderController.getOrder);

// Get order by order number
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;