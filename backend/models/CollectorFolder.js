const mongoose = require('mongoose');

const CollectorFolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a folder name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    phlebotomistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pincodes: [{
        type: String,
        required: true,
        trim: true
    }],
    maxOrdersPerHour: {
        type: Number,
        default: 5,
        required: true,
        min: [1, 'Must have at least 1 order per hour'],
        max: [20, 'Cannot exceed 20 orders per hour']
    },
    workingHours: {
        start: {
            type: Number,
            default: 8,
            min: 0,
            max: 23
        },
        end: {
            type: Number,
            default: 18,
            min: 0,
            max: 23
        }
    },
    isActive: {
        type: Boolean,
        default: true
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

// Update the updatedAt field before saving
CollectorFolderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Validate working hours
CollectorFolderSchema.pre('save', function (next) {
    if (this.workingHours.start >= this.workingHours.end) {
        next(new Error('Working hours end time must be after start time'));
    }
    next();
});

module.exports = mongoose.model('CollectorFolder', CollectorFolderSchema);
