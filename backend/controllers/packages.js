const Package = require('../models/Package');
const Test = require('../models/Test');

// @desc    Get all packages
// @route   GET /api/v1/packages
// @access  Public
exports.getPackages = async (req, res) => {
    try {
        const { category, isActive, isFeatured, search } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (isFeatured !== undefined) {
            query.isFeatured = isFeatured === 'true';
        }

        if (search) {
            query.$text = { $search: search };
        }

        const packages = await Package.find(query)
            .populate('includedTests.testId', 'name category price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching packages',
            error: error.message
        });
    }
};

// @desc    Get single package
// @route   GET /api/v1/packages/:id
// @access  Public
exports.getPackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id)
            .populate('includedTests.testId', 'name description category price originalPrice');

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.status(200).json({
            success: true,
            data: package
        });
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching package',
            error: error.message
        });
    }
};

// @desc    Create new package
// @route   POST /api/v1/packages
// @access  Private/Admin
exports.createPackage = async (req, res) => {
    try {
        const {
            name,
            description,
            shortDescription,
            category,
            subcategory,
            includedTests,
            price,
            originalPrice,
            preparation,
            reportsIn,
            fastingRequired,
            homeSampleCollection,
            isActive,
            isFeatured,
            tags,
            image,
            ageGroup,
            gender,
            benefits,
            whoShouldTake
        } = req.body;

        // Validate included tests
        if (!includedTests || includedTests.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please add at least one test to the package'
            });
        }

        // Verify all test IDs exist
        const testIds = includedTests.map(t => t.testId);
        const tests = await Test.find({ _id: { $in: testIds } });

        if (tests.length !== testIds.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more test IDs are invalid'
            });
        }

        // Create package with populated test information
        const packageData = {
            name,
            description,
            shortDescription,
            category,
            subcategory,
            includedTests: includedTests.map(item => {
                const test = tests.find(t => t._id.toString() === item.testId);
                return {
                    testId: item.testId,
                    testName: test.name,
                    testCategory: test.category
                };
            }),
            price,
            originalPrice,
            preparation,
            reportsIn,
            fastingRequired,
            homeSampleCollection,
            isActive,
            isFeatured,
            tags,
            image,
            ageGroup,
            gender,
            benefits,
            whoShouldTake,
            createdBy: req.user ? req.user.id : null
        };

        const package = await Package.create(packageData);

        res.status(201).json({
            success: true,
            message: 'Package created successfully',
            data: package
        });
    } catch (error) {
        console.error('Error creating package:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A package with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating package',
            error: error.message
        });
    }
};

// @desc    Update package
// @route   PUT /api/v1/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res) => {
    try {
        let package = await Package.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        // If includedTests is being updated, validate and populate test info
        if (req.body.includedTests) {
            const testIds = req.body.includedTests.map(t => t.testId);
            const tests = await Test.find({ _id: { $in: testIds } });

            if (tests.length !== testIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more test IDs are invalid'
                });
            }

            req.body.includedTests = req.body.includedTests.map(item => {
                const test = tests.find(t => t._id.toString() === item.testId);
                return {
                    testId: item.testId,
                    testName: test.name,
                    testCategory: test.category
                };
            });
        }

        package = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('includedTests.testId', 'name category price');

        res.status(200).json({
            success: true,
            message: 'Package updated successfully',
            data: package
        });
    } catch (error) {
        console.error('Error updating package:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A package with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating package',
            error: error.message
        });
    }
};

// @desc    Delete package
// @route   DELETE /api/v1/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        await package.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Package deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting package',
            error: error.message
        });
    }
};

// @desc    Get packages by category
// @route   GET /api/v1/packages/category/:category
// @access  Public
exports.getPackagesByCategory = async (req, res) => {
    try {
        const packages = await Package.find({
            category: req.params.category,
            isActive: true
        })
            .populate('includedTests.testId', 'name category price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        console.error('Error fetching packages by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching packages',
            error: error.message
        });
    }
};

// @desc    Toggle package active status
// @route   PATCH /api/v1/packages/:id/toggle-active
// @access  Private/Admin
exports.togglePackageStatus = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        package.isActive = !package.isActive;
        await package.save();

        res.status(200).json({
            success: true,
            message: `Package ${package.isActive ? 'activated' : 'deactivated'} successfully`,
            data: package
        });
    } catch (error) {
        console.error('Error toggling package status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating package status',
            error: error.message
        });
    }
};
