const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a package name'],
        unique: true,
        trim: true,
        maxlength: [150, 'Name cannot be more than 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot be more than 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Health Checkup', 'Special Care', 'Vital Organ', 'Women Care', 'Men Care', 'Lifestyle', 'Exclusive'],
        trim: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    includedTests: [{
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
            required: true
        },
        testName: {
            type: String,
            required: true
        },
        testCategory: {
            type: String
        }
    }],
    totalTests: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discountPercentage: {
        type: Number,
        min: [0, 'Discount percentage cannot be negative'],
        max: [100, 'Discount percentage cannot exceed 100'],
        default: 0
    },
    preparation: {
        type: String,
        default: 'No special preparation required'
    },
    reportsIn: {
        type: String,
        default: '24-48 hours'
    },
    fastingRequired: {
        type: Boolean,
        default: false
    },
    homeSampleCollection: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: '/images/default-package.png'
    },
    ratings: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 4.5
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    ageGroup: {
        type: String,
        enum: ['All Ages', 'Children', 'Adults', 'Seniors', 'Youth'],
        default: 'All Ages'
    },
    gender: {
        type: String,
        enum: ['All', 'Male', 'Female'],
        default: 'All'
    },
    benefits: {
        type: [String],
        default: []
    },
    whoShouldTake: {
        type: [String],
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update totalTests before saving
PackageSchema.pre('save', function(next) {
    this.totalTests = this.includedTests.length;
    this.updatedAt = Date.now();
    
    // Calculate discount percentage if both prices are provided
    if (this.originalPrice && this.price) {
        this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    
    next();
});

// Create indexes for better query performance
PackageSchema.index({ category: 1 });
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ isFeatured: 1 });
PackageSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Package', PackageSchema);
