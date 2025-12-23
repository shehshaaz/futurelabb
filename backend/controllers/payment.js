const crypto = require('crypto');
const axios = require('axios');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');

// HDFC SmartGateway Configuration
const HDFC_CONFIG = {
    API_KEY: process.env.HDFC_API_KEY || 'A9949FA93754229AB0640140B902BC',
    MERCHANT_ID: process.env.HDFC_MERCHANT_ID || 'SG2238',
    PAYMENT_PAGE_CLIENT_ID: process.env.HDFC_CLIENT_ID || 'hdfcmaster',
    BASE_URL: process.env.HDFC_BASE_URL || 'https://smartgatewayuat.hdfcbank.com',
    RESPONSE_KEY: process.env.HDFC_RESPONSE_KEY || '776522EDCCB4734AAA9C0975FB2724',
    ENABLE_LOGGING: process.env.HDFC_ENABLE_LOGGING === 'true' || false
};

/**
 * Generate HDFC Payment Hash
 */
const generatePaymentHash = (data) => {
    const hashString = `${data.merchantId}|${data.orderId}|${data.amount}|${data.currency}|${HDFC_CONFIG.API_KEY}`;
    return crypto.createHash('sha256').update(hashString).digest('hex');
};

/**
 * Verify HDFC Response Hash
 */
const verifyResponseHash = (data) => {
    const hashString = `${data.orderId}|${data.amount}|${data.status}|${HDFC_CONFIG.RESPONSE_KEY}`;
    const calculatedHash = crypto.createHash('sha256').update(hashString).digest('hex');
    return calculatedHash === data.hash;
};

/**
 * @desc    Create HDFC Payment Order
 * @route   POST /api/v1/payment/hdfc/create-order
 * @access  Private
 */
exports.createHDFCOrder = asyncHandler(async (req, res, next) => {
    const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

    // Validate input
    if (!orderId || !amount) {
        return res.status(400).json({
            success: false,
            message: 'Order ID and amount are required'
        });
    }

    // Get order from database
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this order'
        });
    }

    // Prepare payment data
    const paymentData = {
        merchantId: HDFC_CONFIG.MERCHANT_ID,
        orderId: order._id.toString(),
        amount: amount.toString(),
        currency: 'INR',
        customerName: customerName || req.user.name || 'Customer',
        customerEmail: customerEmail || req.user.email || '',
        customerPhone: customerPhone || req.user.phone || '',
        returnUrl: `${process.env.FRONTEND_URL}/payment/callback`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
        notifyUrl: `${process.env.BACKEND_URL}/api/v1/payment/hdfc/webhook`
    };

    // Generate hash
    paymentData.hash = generatePaymentHash(paymentData);

    // Log if enabled
    if (HDFC_CONFIG.ENABLE_LOGGING) {
        console.log('HDFC Payment Order Created:', {
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            merchantId: paymentData.merchantId
        });
    }

    res.status(200).json({
        success: true,
        data: {
            paymentUrl: `${HDFC_CONFIG.BASE_URL}/payment`,
            paymentData: paymentData,
            clientId: HDFC_CONFIG.PAYMENT_PAGE_CLIENT_ID
        }
    });
});

/**
 * @desc    Handle HDFC Payment Callback
 * @route   POST /api/v1/payment/hdfc/callback
 * @access  Public
 */
exports.handleHDFCCallback = asyncHandler(async (req, res, next) => {
    const {
        orderId,
        amount,
        status,
        transactionId,
        hash,
        paymentMode,
        bankRefNo,
        responseMessage
    } = req.body;

    // Log callback if enabled
    if (HDFC_CONFIG.ENABLE_LOGGING) {
        console.log('HDFC Payment Callback Received:', {
            orderId,
            status,
            transactionId
        });
    }

    // Verify hash
    if (!verifyResponseHash(req.body)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid payment response hash'
        });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Update order based on payment status
    if (status === 'SUCCESS' || status === 'success') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = 'HDFC SmartGateway';
        order.paymentResult = {
            id: transactionId,
            status: status,
            update_time: new Date().toISOString(),
            payment_mode: paymentMode,
            bank_ref_no: bankRefNo,
            response_message: responseMessage
        };
        order.orderStatus = 'confirmed';

        await order.save();

        // Send order confirmation email
        try {
            const { sendOrderConfirmation } = require('../utils/sendEmail');
            const user = await order.populate('user');
            await sendOrderConfirmation(order, user.user);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Payment successful',
            data: {
                orderId: order._id,
                transactionId: transactionId,
                amount: order.totalPrice,
                status: 'success'
            }
        });
    } else {
        // Payment failed
        order.paymentResult = {
            id: transactionId || 'failed',
            status: status,
            update_time: new Date().toISOString(),
            response_message: responseMessage || 'Payment failed'
        };

        await order.save();

        res.status(400).json({
            success: false,
            message: responseMessage || 'Payment failed',
            data: {
                orderId: order._id,
                status: status
            }
        });
    }
});

/**
 * @desc    Handle HDFC Payment Webhook
 * @route   POST /api/v1/payment/hdfc/webhook
 * @access  Public
 */
exports.handleHDFCWebhook = asyncHandler(async (req, res, next) => {
    const {
        orderId,
        amount,
        status,
        transactionId,
        hash
    } = req.body;

    // Log webhook if enabled
    if (HDFC_CONFIG.ENABLE_LOGGING) {
        console.log('HDFC Webhook Received:', {
            orderId,
            status,
            transactionId
        });
    }

    // Verify hash
    if (!verifyResponseHash(req.body)) {
        console.error('Invalid webhook hash');
        return res.status(400).send('Invalid hash');
    }

    // Find and update order
    const order = await Order.findById(orderId);
    if (order && status === 'SUCCESS') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.orderStatus = 'confirmed';
        await order.save();
    }

    // Acknowledge webhook
    res.status(200).send('OK');
});

/**
 * @desc    Verify HDFC Payment Status
 * @route   GET /api/v1/payment/hdfc/verify/:orderId
 * @access  Private
 */
exports.verifyHDFCPayment = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this order'
        });
    }

    res.status(200).json({
        success: true,
        data: {
            orderId: order._id,
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            paymentResult: order.paymentResult,
            orderStatus: order.orderStatus
        }
    });
});

/**
 * @desc    Get HDFC Payment Configuration
 * @route   GET /api/v1/payment/hdfc/config
 * @access  Public
 */
exports.getHDFCConfig = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            merchantId: HDFC_CONFIG.MERCHANT_ID,
            clientId: HDFC_CONFIG.PAYMENT_PAGE_CLIENT_ID,
            paymentUrl: `${HDFC_CONFIG.BASE_URL}/payment`
        }
    });
});

/**
 * @desc    Initiate Refund
 * @route   POST /api/v1/payment/hdfc/refund
 * @access  Private/Admin
 */
exports.initiateRefund = asyncHandler(async (req, res, next) => {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    if (!order.isPaid) {
        return res.status(400).json({
            success: false,
            message: 'Order is not paid yet'
        });
    }

    // Prepare refund data
    const refundData = {
        merchantId: HDFC_CONFIG.MERCHANT_ID,
        orderId: order._id.toString(),
        transactionId: order.paymentResult.id,
        amount: amount || order.totalPrice,
        reason: reason || 'Customer request'
    };

    // Log refund request
    if (HDFC_CONFIG.ENABLE_LOGGING) {
        console.log('Refund Initiated:', refundData);
    }

    // In production, you would call HDFC refund API here
    // For now, we'll just update the order status
    order.orderStatus = 'refunded';
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Refund initiated successfully',
        data: refundData
    });
});


