const express = require('express');
const {
    getAvailableSlots,
    findNextAvailableSlot,
    bookTimeSlot,
    getCollectorBookings,
    cancelBooking
} = require('../controllers/booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableSlots);
router.get('/next-available-slot', findNextAvailableSlot);

// Protected routes
router.post('/book-slot', protect, bookTimeSlot);
router.delete('/cancel/:orderId', protect, cancelBooking);

// Admin routes
router.get('/collector/:folderId', protect, authorize('admin'), getCollectorBookings);

module.exports = router;
