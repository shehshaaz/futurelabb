# Admin Dashboard: Patient Booking Distribution System

## 📋 Feature Overview

A smart booking system that:
1. Groups bookings by pincode
2. Routes bookings to collector folders (phlebotomists)
3. Manages time slot capacity
4. Auto-suggests next available slots when full
5. Sends notifications to patients

## 🏗️ System Architecture

### 1. Database Models

#### CollectorFolder Model
```javascript
// backend/models/CollectorFolder.js
const mongoose = require('mongoose');

const CollectorFolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phlebotomistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pincodes: [{
        type: String,
        required: true
    }],
    maxOrdersPerHour: {
        type: Number,
        default: 5,
        required: true
    },
    workingHours: {
        start: {
            type: Number, // 0-23 (24-hour format)
            default: 8
        },
        end: {
            type: Number,
            default: 18
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CollectorFolder', CollectorFolderSchema);
```

#### TimeSlot Model
```javascript
// backend/models/TimeSlot.js
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
    collectorFolderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectorFolder',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: Number, // 0-23
        required: true
    },
    currentBookings: {
        type: Number,
        default: 0
    },
    maxBookings: {
        type: Number,
        required: true
    },
    bookings: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        patientName: String,
        patientPhone: String,
        bookedAt: Date
    }],
    isAvailable: {
        type: Boolean,
        default: true
    }
});

// Compound index for efficient queries
TimeSlotSchema.index({ collectorFolderId: 1, date: 1, hour: 1 });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
```

### 2. Backend Controllers

#### Collector Folder Controller
```javascript
// backend/controllers/collectorFolder.js
const CollectorFolder = require('../models/CollectorFolder');
const TimeSlot = require('../models/TimeSlot');
const asyncHandler = require('../middleware/async');

// @desc    Create collector folder
// @route   POST /api/v1/admin/collector-folders
// @access  Private/Admin
exports.createCollectorFolder = asyncHandler(async (req, res) => {
    const { name, phlebotomistId, pincodes, maxOrdersPerHour, workingHours } = req.body;

    const folder = await CollectorFolder.create({
        name,
        phlebotomistId,
        pincodes,
        maxOrdersPerHour,
        workingHours
    });

    res.status(201).json({
        success: true,
        data: folder
    });
});

// @desc    Get all collector folders
// @route   GET /api/v1/admin/collector-folders
// @access  Private/Admin
exports.getCollectorFolders = asyncHandler(async (req, res) => {
    const folders = await CollectorFolder.find()
        .populate('phlebotomistId', 'name phone email');

    res.status(200).json({
        success: true,
        count: folders.length,
        data: folders
    });
});

// @desc    Update collector folder
// @route   PUT /api/v1/admin/collector-folders/:id
// @access  Private/Admin
exports.updateCollectorFolder = asyncHandler(async (req, res) => {
    const folder = await CollectorFolder.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

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

// @desc    Delete collector folder
// @route   DELETE /api/v1/admin/collector-folders/:id
// @access  Private/Admin
exports.deleteCollectorFolder = asyncHandler(async (req, res) => {
    const folder = await CollectorFolder.findByIdAndDelete(req.params.id);

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'Collector folder not found'
        });
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});
```

#### Booking Controller
```javascript
// backend/controllers/booking.js
const CollectorFolder = require('../models/CollectorFolder');
const TimeSlot = require('../models/TimeSlot');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');

// @desc    Get available time slots for a pincode
// @route   GET /api/v1/bookings/available-slots
// @access  Public
exports.getAvailableSlots = asyncHandler(async (req, res) => {
    const { pincode, date } = req.query;

    // Find collector folder for this pincode
    const folder = await CollectorFolder.findOne({
        pincodes: pincode,
        isActive: true
    });

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    // Get or create time slots for the date
    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    const slots = [];
    for (let hour = folder.workingHours.start; hour < folder.workingHours.end; hour++) {
        let slot = await TimeSlot.findOne({
            collectorFolderId: folder._id,
            date: requestedDate,
            hour: hour
        });

        if (!slot) {
            // Create slot if doesn't exist
            slot = await TimeSlot.create({
                collectorFolderId: folder._id,
                date: requestedDate,
                hour: hour,
                maxBookings: folder.maxOrdersPerHour,
                currentBookings: 0,
                isAvailable: true
            });
        }

        // Update availability
        slot.isAvailable = slot.currentBookings < slot.maxBookings;

        slots.push({
            id: slot._id,
            hour: hour,
            timeRange: `${hour}:00 - ${hour + 1}:00`,
            available: slot.isAvailable,
            currentBookings: slot.currentBookings,
            maxBookings: slot.maxBookings,
            remainingSlots: slot.maxBookings - slot.currentBookings
        });
    }

    res.status(200).json({
        success: true,
        data: {
            collectorFolder: folder.name,
            date: requestedDate,
            slots: slots
        }
    });
});

// @desc    Find next available slot
// @route   GET /api/v1/bookings/next-available-slot
// @access  Public
exports.findNextAvailableSlot = asyncHandler(async (req, res) => {
    const { pincode, currentHour, date } = req.query;

    const folder = await CollectorFolder.findOne({
        pincodes: pincode,
        isActive: true
    });

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    // Search for next available slot
    for (let hour = parseInt(currentHour) + 1; hour < folder.workingHours.end; hour++) {
        let slot = await TimeSlot.findOne({
            collectorFolderId: folder._id,
            date: requestedDate,
            hour: hour
        });

        if (!slot) {
            slot = await TimeSlot.create({
                collectorFolderId: folder._id,
                date: requestedDate,
                hour: hour,
                maxBookings: folder.maxOrdersPerHour,
                currentBookings: 0,
                isAvailable: true
            });
        }

        if (slot.currentBookings < slot.maxBookings) {
            return res.status(200).json({
                success: true,
                data: {
                    available: true,
                    hour: hour,
                    timeRange: `${hour}:00 - ${hour + 1}:00`,
                    remainingSlots: slot.maxBookings - slot.currentBookings
                }
            });
        }
    }

    // No slots available today, suggest next day
    res.status(200).json({
        success: true,
        data: {
            available: false,
            message: 'No slots available today. Please try tomorrow.',
            nextAvailableDate: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)
        }
    });
});

// @desc    Book a time slot
// @route   POST /api/v1/bookings/book-slot
// @access  Private
exports.bookTimeSlot = asyncHandler(async (req, res) => {
    const { orderId, pincode, date, hour } = req.body;

    // Find collector folder
    const folder = await CollectorFolder.findOne({
        pincodes: pincode,
        isActive: true
    });

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    // Find or create time slot
    let slot = await TimeSlot.findOne({
        collectorFolderId: folder._id,
        date: requestedDate,
        hour: parseInt(hour)
    });

    if (!slot) {
        slot = await TimeSlot.create({
            collectorFolderId: folder._id,
            date: requestedDate,
            hour: parseInt(hour),
            maxBookings: folder.maxOrdersPerHour,
            currentBookings: 0,
            isAvailable: true
        });
    }

    // Check if slot is available
    if (slot.currentBookings >= slot.maxBookings) {
        return res.status(400).json({
            success: false,
            error: 'This time slot is full',
            nextAvailable: await findNextSlot(folder._id, requestedDate, parseInt(hour))
        });
    }

    // Get order details
    const order = await Order.findById(orderId).populate('user');

    // Add booking to slot
    slot.bookings.push({
        orderId: order._id,
        patientName: order.user.name,
        patientPhone: order.user.phone,
        bookedAt: new Date()
    });
    slot.currentBookings += 1;
    slot.isAvailable = slot.currentBookings < slot.maxBookings;
    await slot.save();

    // Update order with booking details
    order.bookingDetails = {
        collectorFolderId: folder._id,
        collectorName: folder.name,
        scheduledDate: requestedDate,
        scheduledHour: parseInt(hour),
        timeRange: `${hour}:00 - ${parseInt(hour) + 1}:00`
    };
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Booking confirmed',
        data: {
            orderId: order._id,
            collectorName: folder.name,
            scheduledDate: requestedDate,
            timeRange: `${hour}:00 - ${parseInt(hour) + 1}:00`,
            remainingSlots: slot.maxBookings - slot.currentBookings
        }
    });
});

// Helper function to find next available slot
async function findNextSlot(folderId, date, currentHour) {
    const folder = await CollectorFolder.findById(folderId);
    
    for (let hour = currentHour + 1; hour < folder.workingHours.end; hour++) {
        const slot = await TimeSlot.findOne({
            collectorFolderId: folderId,
            date: date,
            hour: hour
        });

        if (!slot || slot.currentBookings < slot.maxBookings) {
            return {
                hour: hour,
                timeRange: `${hour}:00 - ${hour + 1}:00`
            };
        }
    }

    return null;
}
```

### 3. Frontend Components

#### Admin: Collector Folder Manager
```javascript
// frontend/src/admin/CollectorFolderManager.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../utils/api';

const CollectorFolderManager = () => {
    const [folders, setFolders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phlebotomistId: '',
        pincodes: '',
        maxOrdersPerHour: 5,
        workingHours: {
            start: 8,
            end: 18
        }
    });

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const response = await apiService.getCollectorFolders();
            if (response.success) {
                setFolders(response.data);
            }
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                pincodes: formData.pincodes.split(',').map(p => p.trim())
            };
            
            const response = await apiService.createCollectorFolder(data);
            if (response.success) {
                alert('Collector folder created successfully!');
                setShowForm(false);
                fetchFolders();
                resetForm();
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            alert('Failed to create collector folder');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phlebotomistId: '',
            pincodes: '',
            maxOrdersPerHour: 5,
            workingHours: { start: 8, end: 18 }
        });
    };

    return (
        <div className="collector-folder-manager">
            <div className="header">
                <h2>Collector Folder Management</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Folder'}
                </button>
            </div>

            {showForm && (
                <div className="folder-form card p-4 mb-4">
                    <h3>Create Collector Folder</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Folder Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Pincodes (comma-separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="560001, 560002, 560003"
                                value={formData.pincodes}
                                onChange={(e) => setFormData({...formData, pincodes: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Max Orders Per Hour</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                max="20"
                                value={formData.maxOrdersPerHour}
                                onChange={(e) => setFormData({...formData, maxOrdersPerHour: parseInt(e.target.value)})}
                                required
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label>Working Hours Start</label>
                                <select
                                    className="form-control"
                                    value={formData.workingHours.start}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        workingHours: {...formData.workingHours, start: parseInt(e.target.value)}
                                    })}
                                >
                                    {[...Array(24)].map((_, i) => (
                                        <option key={i} value={i}>{i}:00</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label>Working Hours End</label>
                                <select
                                    className="form-control"
                                    value={formData.workingHours.end}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        workingHours: {...formData.workingHours, end: parseInt(e.target.value)}
                                    })}
                                >
                                    {[...Array(24)].map((_, i) => (
                                        <option key={i} value={i}>{i}:00</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success">
                            Create Folder
                        </button>
                    </form>
                </div>
            )}

            <div className="folders-list">
                <h3>Existing Folders</h3>
                <div className="row">
                    {folders.map(folder => (
                        <div key={folder._id} className="col-md-6 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5>{folder.name}</h5>
                                    <p><strong>Pincodes:</strong> {folder.pincodes.join(', ')}</p>
                                    <p><strong>Max Orders/Hour:</strong> {folder.maxOrdersPerHour}</p>
                                    <p><strong>Working Hours:</strong> {folder.workingHours.start}:00 - {folder.workingHours.end}:00</p>
                                    <p><strong>Status:</strong> 
                                        <span className={`badge ${folder.isActive ? 'bg-success' : 'bg-danger'}`}>
                                            {folder.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectorFolderManager;
```

#### Patient: Time Slot Selector
```javascript
// frontend/src/components/TimeSlotSelector.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../utils/api';

const TimeSlotSelector = ({ pincode, onSlotSelected }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        if (pincode && selectedDate) {
            fetchAvailableSlots();
        }
    }, [pincode, selectedDate]);

    const fetchAvailableSlots = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAvailableSlots(pincode, selectedDate);
            if (response.success) {
                setAvailableSlots(response.data.slots);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            alert('Failed to fetch available slots');
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = async (slot) => {
        if (!slot.available) {
            // Find next available slot
            try {
                const response = await apiService.findNextAvailableSlot(
                    pincode,
                    slot.hour,
                    selectedDate
                );

                if (response.success && response.data.available) {
                    setNotificationMessage(
                        `Sorry, this slot is full. Next available slot is ${response.data.timeRange}`
                    );
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                } else {
                    setNotificationMessage(
                        'Sorry, no slots available today. Please try tomorrow.'
                    );
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                }
            } catch (error) {
                console.error('Error finding next slot:', error);
            }
        } else {
            setSelectedSlot(slot);
            onSlotSelected(slot);
        }
    };

    return (
        <div className="time-slot-selector">
            {showNotification && (
                <div className="alert alert-warning notification-popup">
                    <i className="fas fa-exclamation-triangle"></i>
                    {notificationMessage}
                </div>
            )}

            <div className="date-selector mb-4">
                <label>Select Date:</label>
                <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="slots-grid">
                    <h5>Available Time Slots</h5>
                    <div className="row">
                        {availableSlots.map(slot => (
                            <div key={slot.id} className="col-md-3 col-sm-6 mb-3">
                                <div
                                    className={`slot-card ${slot.available ? 'available' : 'full'} ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                    onClick={() => handleSlotClick(slot)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="slot-time">{slot.timeRange}</div>
                                    <div className="slot-info">
                                        {slot.available ? (
                                            <>
                                                <span className="badge bg-success">Available</span>
                                                <small>{slot.remainingSlots} slots left</small>
                                            </>
                                        ) : (
                                            <span className="badge bg-danger">Full</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .slot-card {
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                    transition: all 0.3s;
                }

                .slot-card.available {
                    border-color: #28a745;
                    background: #f8fff9;
                }

                .slot-card.available:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
                }

                .slot-card.full {
                    border-color: #dc3545;
                    background: #fff5f5;
                    opacity: 0.7;
                }

                .slot-card.selected {
                    border-color: #007bff;
                    background: #e7f3ff;
                    box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
                }

                .slot-time {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .notification-popup {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TimeSlotSelector;
```

### 4. API Service Updates

```javascript
// frontend/src/utils/api.js - Add these methods

// Collector Folder Management
async getCollectorFolders() {
    return this.request('/api/v1/admin/collector-folders');
}

async createCollectorFolder(data) {
    return this.request('/api/v1/admin/collector-folders', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async updateCollectorFolder(id, data) {
    return this.request(`/api/v1/admin/collector-folders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async deleteCollectorFolder(id) {
    return this.request(`/api/v1/admin/collector-folders/${id}`, {
        method: 'DELETE'
    });
}

// Booking Management
async getAvailableSlots(pincode, date) {
    return this.request(`/api/v1/bookings/available-slots?pincode=${pincode}&date=${date}`);
}

async findNextAvailableSlot(pincode, currentHour, date) {
    return this.request(`/api/v1/bookings/next-available-slot?pincode=${pincode}&currentHour=${currentHour}&date=${date}`);
}

async bookTimeSlot(data) {
    return this.request('/api/v1/bookings/book-slot', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
```

### 5. Backend Routes

```javascript
// backend/routes/collectorFolders.js
const express = require('express');
const {
    createCollectorFolder,
    getCollectorFolders,
    updateCollectorFolder,
    deleteCollectorFolder
} = require('../controllers/collectorFolder');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getCollectorFolders)
    .post(protect, authorize('admin'), createCollectorFolder);

router.route('/:id')
    .put(protect, authorize('admin'), updateCollectorFolder)
    .delete(protect, authorize('admin'), deleteCollectorFolder);

module.exports = router;
```

```javascript
// backend/routes/bookings.js
const express = require('express');
const {
    getAvailableSlots,
    findNextAvailableSlot,
    bookTimeSlot
} = require('../controllers/booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/available-slots', getAvailableSlots);
router.get('/next-available-slot', findNextAvailableSlot);
router.post('/book-slot', protect, bookTimeSlot);

module.exports = router;
```

### 6. Server.js Updates

```javascript
// backend/server.js - Add these routes
const collectorFolderRoutes = require('./routes/collectorFolders');
const bookingRoutes = require('./routes/bookings');

app.use('/api/v1/admin/collector-folders', collectorFolderRoutes);
app.use('/api/v1/bookings', bookingRoutes);
```

## 📊 Implementation Steps

1. **Create Database Models**
   - CollectorFolder model
   - TimeSlot model
   - Update Order model with booking details

2. **Backend Implementation**
   - Create controllers
   - Create routes
   - Register routes in server.js

3. **Frontend Implementation**
   - Admin: Collector Folder Manager
   - Patient: Time Slot Selector
   - Update API service

4. **Testing**
   - Create collector folders
   - Test slot availability
   - Test booking flow
   - Test notifications

## 🎯 Key Features

✅ Automatic pincode-based routing
✅ Configurable max orders per hour
✅ Real-time slot availability
✅ Auto-suggest next available slot
✅ Patient notifications
✅ Admin dashboard for management
✅ Smooth distribution across phlebotomists

This system will ensure efficient booking distribution and prevent overload!
