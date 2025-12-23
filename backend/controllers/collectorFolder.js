const CollectorFolder = require('../models/CollectorFolder');
const TimeSlot = require('../models/TimeSlot');
const asyncHandler = require('../middleware/async');

// @desc    Create collector folder
// @route   POST /api/v1/admin/collector-folders
// @access  Private/Admin
exports.createCollectorFolder = asyncHandler(async (req, res) => {
    const { name, phlebotomistId, pincodes, maxOrdersPerHour, workingHours } = req.body;

    // Validate input
    if (!name || !phlebotomistId || !pincodes || pincodes.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Please provide name, phlebotomist, and at least one pincode'
        });
    }

    const folder = await CollectorFolder.create({
        name,
        phlebotomistId,
        pincodes,
        maxOrdersPerHour: maxOrdersPerHour || 5,
        workingHours: workingHours || { start: 8, end: 18 }
    });

    await folder.populate('phlebotomistId', 'name phone email');

    res.status(201).json({
        success: true,
        message: 'Collector folder created successfully',
        data: folder
    });
});

// @desc    Get all collector folders
// @route   GET /api/v1/admin/collector-folders
// @access  Private/Admin
exports.getCollectorFolders = asyncHandler(async (req, res) => {
    const folders = await CollectorFolder.find()
        .populate('phlebotomistId', 'name phone email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: folders.length,
        data: folders
    });
});

// @desc    Get single collector folder
// @route   GET /api/v1/admin/collector-folders/:id
// @access  Private/Admin
exports.getCollectorFolder = asyncHandler(async (req, res) => {
    const folder = await CollectorFolder.findById(req.params.id)
        .populate('phlebotomistId', 'name phone email');

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'Collector folder not found'
        });
    }

    res.status(200).json({
        success: true,
        data: folder
    });
});

// @desc    Update collector folder
// @route   PUT /api/v1/admin/collector-folders/:id
// @access  Private/Admin
exports.updateCollectorFolder = asyncHandler(async (req, res) => {
    let folder = await CollectorFolder.findById(req.params.id);

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'Collector folder not found'
        });
    }

    folder = await CollectorFolder.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('phlebotomistId', 'name phone email');

    res.status(200).json({
        success: true,
        message: 'Collector folder updated successfully',
        data: folder
    });
});

// @desc    Delete collector folder
// @route   DELETE /api/v1/admin/collector-folders/:id
// @access  Private/Admin
exports.deleteCollectorFolder = asyncHandler(async (req, res) => {
    const folder = await CollectorFolder.findById(req.params.id);

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'Collector folder not found'
        });
    }

    // Delete all associated time slots
    await TimeSlot.deleteMany({ collectorFolderId: folder._id });

    await folder.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Collector folder deleted successfully',
        data: {}
    });
});

// @desc    Get folder by pincode
// @route   GET /api/v1/admin/collector-folders/pincode/:pincode
// @access  Public
exports.getFolderByPincode = asyncHandler(async (req, res) => {
    const folder = await CollectorFolder.findOne({
        pincodes: req.params.pincode,
        isActive: true
    }).populate('phlebotomistId', 'name phone');

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    res.status(200).json({
        success: true,
        data: folder
    });
});

// @desc    Get folder statistics
// @route   GET /api/v1/admin/collector-folders/:id/stats
// @access  Private/Admin
exports.getFolderStats = asyncHandler(async (req, res) => {
    const folder = await CollectorFolder.findById(req.params.id);

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'Collector folder not found'
        });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's slots
    const todaySlots = await TimeSlot.find({
        collectorFolderId: folder._id,
        date: { $gte: today, $lt: tomorrow }
    });

    const totalSlots = todaySlots.length;
    const totalBookings = todaySlots.reduce((sum, slot) => sum + slot.currentBookings, 0);
    const availableSlots = todaySlots.filter(slot => slot.isAvailable).length;

    res.status(200).json({
        success: true,
        data: {
            folder: folder.name,
            today: {
                totalSlots,
                totalBookings,
                availableSlots,
                utilizationRate: totalSlots > 0 ? ((totalBookings / (totalSlots * folder.maxOrdersPerHour)) * 100).toFixed(2) : 0
            }
        }
    });
});
