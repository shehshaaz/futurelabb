const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserRole,
    toggleUserVerification,
    getUserStats
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

const router = express.Router();

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

router.route('/stats')
    .get(getUserStats);

router.route('/')
    .get(advancedResults(User, { path: 'orders', select: 'totalPrice createdAt' }), getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/role')
    .patch(updateUserRole);

router.route('/:id/verify')
    .patch(toggleUserVerification);

module.exports = router;
