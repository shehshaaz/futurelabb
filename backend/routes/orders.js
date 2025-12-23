const express = require('express');
const {
    getOrders,
    getMyOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    deleteOrder,
    getDashboardStats,
    updateOrderStatus
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Order = require('../models/Order');

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), advancedResults(Order, 'user'), getOrders)
    .post(protect, createOrder);

router.route('/stats')
    .get(protect, authorize('admin'), getDashboardStats);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrder)
    .delete(protect, authorize('admin'), deleteOrder);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
    .put(protect, authorize('admin'), updateOrderToDelivered);

router.route('/:id/status')
    .put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;