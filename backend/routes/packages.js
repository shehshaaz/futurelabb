const express = require('express');
const router = express.Router();
const {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    getPackagesByCategory,
    togglePackageStatus
} = require('../controllers/packages');

// Public routes
router.get('/', getPackages);
router.get('/category/:category', getPackagesByCategory);
router.get('/:id', getPackage);

// Admin routes (add authentication middleware as needed)
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);
router.patch('/:id/toggle-active', togglePackageStatus);

module.exports = router;
