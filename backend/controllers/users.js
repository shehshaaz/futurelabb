const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('orders');

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
    });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: {}
    });
});

// @desc    Update user role
// @route   PATCH /api/v1/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    user.role = req.body.role;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User role updated to ${req.body.role}`,
        data: user
    });
});

// @desc    Toggle user verification status
// @route   PATCH /api/v1/users/:id/verify
// @access  Private/Admin
exports.toggleUserVerification = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
        data: user
    });
});

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
        success: true,
        data: {
            totalUsers,
            verifiedUsers,
            adminUsers,
            newUsers,
            unverifiedUsers: totalUsers - verifiedUsers
        }
    });
});
